import { Client } from './client/entities/client.entity';

declare module 'express-serve-static-core' {
  interface Request {
    user?: Client; // JWT를 통해 인증된 사용자 정보
  }
}
