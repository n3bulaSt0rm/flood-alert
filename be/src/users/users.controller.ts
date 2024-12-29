import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/user.dto';
import { UsersEntity } from './entities/users.entity';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Post()
  public async createUser(@Body() request: CreateUserDto): Promise<{message: string}> {
    try {
      const resp = await this.usersService.createUser(request);
      return { message: resp };
    } catch (error) {
      return { message: error.message };
    }
  }

  @Get('/:id')
  public async getUser(@Param('id') id: string): Promise<UsersEntity | any> {
    return await this.usersService.getUser(id) ?? {};
  }

  @Get()
  public async getUsers(): Promise<UsersEntity[]> {
    return await this.usersService.getUsers();
  }

  @Delete('/:id')
  public async deleteUser(@Param('id') id: string): Promise<void> {
    await this.usersService.deleteUser(id);
  }

  @Post('/verify-otp')
  public async verifyOtp(@Body() body: { email: string; otp: string }): Promise<{ message: string }> {
    try {
      await this.usersService.verifyOtp(body.email, body.otp);
      return { message: 'OTP verification successful.' };
    } catch (error) {
        return { message: error.message };
    }
  }
}