import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: '',
      callbackURL: process.env.KAKAO_CALLBACK_URI,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { id, username, _json } = profile;
    const kakaoAccount = _json && _json.kakao_account ? _json.kakao_account : {};
    const email = kakaoAccount.email ? kakaoAccount.email : `${id}@kakao.com`;
    const name = username || 'Unknown';

    const user = {
      email: email,
      name: name,
      kakaoId: id,
      accessToken,
    };
    done(null, user);
  }
}
