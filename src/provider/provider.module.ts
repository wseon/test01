import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
import { Provider } from './entities/provider.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    TypeOrmModule.forFeature([Provider]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ProviderService],
  controllers: [ProviderController],
})
export class ProviderModule {}
