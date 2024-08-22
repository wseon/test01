import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client} from 'src/client/entities/client.entity';
import { RegisterClientDto } from './dto/register-client.dto';

import { LoginClientDto } from './dto/login-client.dto';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    private jwtService: JwtService,
  ) {}

  async registerClient(registerClientDto: RegisterClientDto): Promise<Client> {
    const { name, email, password, googleId, kakaoId, authProvider } = registerClientDto;
    
    // check duplicated email
    const existingClient = await this.clientsRepository.findOne({ where: { email } });
    if (existingClient) {
      throw new Error('Email already in use');
    }

    const client = new Client();
    client.name = name;
    client.email = email;
    client.authProvider = authProvider;

    if (authProvider === 'email') {
      const hashedPassword = await bcrypt.hash(password, 10);
      client.password = hashedPassword;
    } else if (authProvider === 'google') {
      client.googleId = googleId;
    } else if (authProvider === 'kakao') {
      client.kakaoId = kakaoId;
    }

    return this.clientsRepository.save(client);
  }

  async loginClient(loginClientDto: LoginClientDto): Promise<{ accessToken: string}> {
    const { email, password } = loginClientDto;
    const client = await this.clientsRepository.findOne({ where: { email } });

    if (!client || !client.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(password, client.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: client.email, sub: client.id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async googleLogin(req) {
    if (!req.user) {
      return 'No user from Google';
    }

    const { email, googleId, name } = req.user;
    let client = await this.clientsRepository.findOne({ where: { googleId } });

    if (!client) {
      client = await this.clientsRepository.findOne({ where: { email } });
    }

    if (!client) {
      client = new Client();
      client.email = email;
      client.googleId = googleId;
      client.name = name;
      client.authProvider = 'google';
      client = await this.clientsRepository.save(client);
    }

    const payload = { email: client.email, sub: client.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'User information from Google',
      user: req.user,
      accessToken,
    }

  }

  async kakaoLogin(req) {
    if (!req.user) {
      return 'No user from Kakao';
    }

    const { email, kakaoId, name } = req.user;

    let client = await this.clientsRepository.findOne({ where: { kakaoId } });

    if (!client) {
      client = await this.clientsRepository.findOne({ where: { email } });
    }

    if (!client) {
      client = new Client();
      client.email = email;
      client.kakaoId = kakaoId;
      client.name = name;
      client.authProvider = 'kakao';
      client = await this.clientsRepository.save(client);
    }

    const payload = { email: client.email, sub: client.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'User information from Kakao',
      user: req.user,
      accessToken,
    };
  }

  async deleteClientAccount(clientId: number): Promise<void> {
    console.log('AAAAAAAAAAAAAAAAAAAAA')
    console.log(clientId)
    const client = await this.clientsRepository.findOne({ where: { id: clientId } });

    if (!client) {
      throw new NotFoundException('Client not found');
    }
    
    await this.clientsRepository.remove(client);
  }

}