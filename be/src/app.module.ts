import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from  '@nestjs/config';
import { configuration } from './config/configuration';
import { LogsMiddleware } from './common/middlewares/logs.middleware';
import { DevicesModule } from './devices/devices.module';
import { HistoriesModule } from './histories/histories.module';
import { MqttModule } from './mqtt/mqtt.module';

const VALID_ENV = ['local', 'development', 'production'];

const environment = process.env.NODE_ENV ?? 'local';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/env/.env.${
        VALID_ENV.includes(environment) ? environment : 'local'
      }`,
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    DevicesModule,
    HistoriesModule,
    MqttModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
