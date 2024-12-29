import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/user.dto';
import { UsersEntity } from './entities/users.entity';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  public async createUser(@Body() request: CreateUserDto): Promise<UsersEntity> {
    return await this.usersService.createUser(request);
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
}