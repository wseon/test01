import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Client } from 'src/client/entities/client.entity';

import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth-guard';

import { PassportModule } from '@nestjs/passport';

import { GoogleStrategy } from './strategies/google.strategy';

import { KakaoStrategy } from './strategies/kakao.strategy';

import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, KakaoStrategy, JwtStrategy, JwtAuthGuard],
})

export class AuthModule {
  constructor() {
    console.log('APP JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);
  }
}
