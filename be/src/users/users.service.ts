import { Injectable, Logger, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';
import { Repository, DeleteResult } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import Redis from 'ioredis';

@Injectable()
export class UsersService {
  private TAG: string = 'UsersService';

  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
    private readonly httpService: HttpService,
  ) {}

  public async createUser(dto: CreateUserDto): Promise<string> {
    Logger.debug('Create User', this.TAG);

    const existingUser = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('Email đã tồn tại!');
    }

    await this.redisClient.del(dto.email);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redisClient.setex(dto.email, 90, otp);
    const message = `Mã OTP của bạn là: ${otp}`;
    const emailData = {
      message,
      users: [dto.email],
    };

    await lastValueFrom(this.httpService.post('http://localhost:8082/email/send', emailData, {
      headers: { 'Content-Type': 'application/json' },
    }));

    return `Mã OTP đã được gửi đến ${dto.email}. Vui lòng kiểm tra email để xác thực.`;
  }

  public async verifyOtp(email: string, otp: string): Promise<UsersEntity> {
    const cachedOtp = await this.redisClient.get(email);
    if (cachedOtp && cachedOtp === otp) {
      await this.redisClient.del(email);

      const user = this.userRepository.create({ email });
      return await this.userRepository.save(user);
    }
    throw new ConflictException('Mã OTP không hợp lệ. Vui lòng thử lại.');
  }

  public async getUser(id: string): Promise<UsersEntity | null> {
    Logger.debug('Get User', this.TAG);
    return await this.userRepository.findOne({ where: { id } });
  }

  public async getUsers(): Promise<UsersEntity[]> {
    Logger.debug('Get Users', this.TAG);
    return await this.userRepository.find();
  }

  public async deleteUser(id: string): Promise<DeleteResult> {
    Logger.debug('Delete User', this.TAG);
    const user = await this.getUser(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found!`);
    }
    return await this.userRepository.delete(id);
  }
}
