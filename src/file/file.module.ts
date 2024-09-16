import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  imports: [
    ConfigModule,
  ],
  controllers: [FileController],
  providers: [
    FileService,
    {
      provide: 'S3Client',
      useFactory: (configService: ConfigService) => {
        return new S3Client({
          region: configService.get<string>('AWS_REGION'),
          credentials: {
            accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class FileModule {}
