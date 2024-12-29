import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const client = new Redis({
          host: 'redis-18556.c290.ap-northeast-1-2.ec2.redns.redis-cloud.com',
          port: 18556,
          password: 'TI2qPtDutPMrKGdkcQndzlha6QwoOlNd',
          username: 'default'
        });
        client.on('connect', () => {
          console.log('Connected to Redis');
        });
        client.on('error', (err: any) => {
          console.error('Redis error:', err);
        });
        return client;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisCacheModule {}
