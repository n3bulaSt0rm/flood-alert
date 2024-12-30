import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDeviceDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsString()
  deviceName: string;

  @IsNotEmpty()
  @IsString()
  location: string;
}

export class UpdateDeviceDto {
  @IsNotEmpty()
  id: string;

  @IsString()
  deviceName?: string;

  @IsString()
  location?: string;
}