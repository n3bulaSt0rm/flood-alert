import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}

export class UpdateUserDto {
  @IsNotEmpty()
  id: string;

  @IsString()
  email?: string;
}