import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
/*
  app.enableCors({
    origin: 'http://192.168.0.131.nip.io:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
*/

  app.enableCors()
  await app.listen(3000);
}
bootstrap();
