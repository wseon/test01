export class RegisterClientDto {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  kakaoId?: string;
  authProvider: 'email' | 'google' | 'kakao';
}
