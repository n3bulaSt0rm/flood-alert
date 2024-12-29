import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { UsersService } from './users.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';
import { UsersController } from './users.controller';
import { RedisCacheModule } from '../../cache/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    HttpModule,
    CacheModule.register(),
    RedisCacheModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
