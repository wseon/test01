import { Injectable, Inject } from '@nestjs/common';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { Response } from 'express';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { Readable } from 'stream';

const pipelinePromise = promisify(pipeline);

@Injectable()
export class FileService {
  constructor(
    @Inject('S3Client') private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<any> {
    const fileExtension = extname(file.originalname);
    const fileKey = `${uuidv4()}${fileExtension}`;

    const uploadParams = {
      Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await this.s3Client.send(new PutObjectCommand(uploadParams));

    const fileUrl = `https://${this.configService.get<string>('AWS_S3_BUCKET_NAME')}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${fileKey}`;

    return {
      message: 'File uploaded successfully!',
      fileUrl: fileUrl,
    };
  }

  // S3에서 파일 다운로드
  async downloadFile(fileKey: string, res: Response): Promise<void> {
    const downloadParams = {
      Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
      Key: fileKey,
    };

    try {
      const command = new GetObjectCommand(downloadParams);
      const data = await this.s3Client.send(command);

      const s3Stream = data.Body as Readable;
      await pipelinePromise(s3Stream, res);
    } catch (error) {
      res.status(404).json({ message: 'File not found' });
    }
  }
}
