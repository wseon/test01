import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from 'src/auth/entities/client.entity';
import { Broker } from 'src/auth/entities/broker.entity';
import { Provider } from 'src/auth/entities/provider.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectRepository(Broker)
    private brokersRepository: Repository<Broker>,
    @InjectRepository(Provider)
    private providersRepository: Repository<Provider>,

  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    let user;

    if (payload.roles === 'client') {
      user = await this.clientsRepository.findOne({ where: { id: payload.sub } });
    } else if (payload.roles === 'broker') {
      user = await this.brokersRepository.findOne({ where: { id: payload.sub } });
    } else if (payload.roles === 'provider') {
      user = await this.providersRepository.findOne({ where: { id: payload.sub } });
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    return { id: user.id, email: user.email, roles: payload.roles };
  }
}
