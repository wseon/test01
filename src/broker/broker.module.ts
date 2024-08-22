import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { BrokerService } from './broker.service';
import { BrokerController } from './broker.controller';
import { Broker } from './entities/broker.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    TypeOrmModule.forFeature([Broker]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [BrokerService],
  controllers: [BrokerController],
})
export class BrokerModule {}
