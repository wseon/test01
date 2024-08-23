import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';

import { ClientModule } from './client/client.module';
import { Client } from './client/entities/client.entity';

import { BrokerModule } from './broker/broker.module';

import { RequestModule } from './request/request.module';

import { BidModule } from './bid/bid.module';

import { ProviderModule } from './provider/provider.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // for dev. if prd, false
    }),
    AuthModule,
    ClientModule,
    BrokerModule,
    RequestModule,
    ProviderModule,
    BidModule,
  ],
})
export class AppModule {}
