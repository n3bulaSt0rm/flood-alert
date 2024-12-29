import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';
import { Repository, DeleteResult } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  private TAG: string = 'UsersService';

  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {}

  public async createUser(dto: CreateUserDto): Promise<UsersEntity> {
    Logger.debug('Create User', this.TAG);
    return await this.userRepository.save(dto);
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