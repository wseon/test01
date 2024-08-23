import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Client} from './entities/client.entity';
import { RegisterClientDto } from './dto/register-client.dto';
import { LoginClientDto } from './dto/login-client.dto';

import { Broker } from './entities/broker.entity';
import { RegisterBrokerDto } from './dto/register-broker.dto';

import { Provider } from './entities/provider.entity';
import { RegisterProviderDto } from './dto/register-provider.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectRepository(Broker)
    private brokersRepository: Repository<Broker>,
    @InjectRepository(Provider)
    private providersRepository: Repository<Provider>,
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
    const client = await this.clientsRepository.findOne({ where: { id: clientId } });

    if (!client) {
      throw new NotFoundException('Client not found');
    }
    
    await this.clientsRepository.remove(client);
  }

  async registerBroker(registerDto: RegisterBrokerDto): Promise<Broker> {
    const { email, businessNumber } = registerDto;

    const existingBroker = await this.brokersRepository.findOne({ where: { businessNumber } });

    if (existingBroker) {
      throw new ConflictException('Business Number already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    registerDto.password = hashedPassword;
    const broker = this.brokersRepository.create(registerDto);

    return this.brokersRepository.save(broker);
  }

  async validateBroker(email: string, password: string): Promise<Broker | null> {
    const broker = await this.brokersRepository.findOne({ where: { email } });

    const passwordValid = await bcrypt.compare(password, broker.password);
    if (!broker || !passwordValid || !broker.isApproved) {
      return null;
    }

    return broker;
  }

  async loginBroker(broker: Broker): Promise<{ accessToken: string }> {
    const payload = { email: broker.email, sub: broker.id };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async approveBroker(id: number): Promise<Broker> {
    const broker = await this.brokersRepository.findOne({ where: { id } });
    if (!broker) {
      throw new NotFoundException('Broker not found');
    }
    broker.isApproved = true;
    return this.brokersRepository.save(broker);
  }

  async registerProvider(registerDto: RegisterProviderDto): Promise<Provider> {
    const { email, businessNumber } = registerDto;

    const existingProvider = await this.providersRepository.findOne({ where: { businessNumber } });

    if (existingProvider) {
      throw new ConflictException('Business Number already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    registerDto.password = hashedPassword;
    const provider = this.providersRepository.create(registerDto);

    return this.providersRepository.save(provider);
  }

  async validateProvider(email: string, password: string): Promise<Provider> {
    const provider = await this.providersRepository.findOne({ where: { email } });

    const passwordValid = await bcrypt.compare(password, provider.password);
    if (!provider || !passwordValid || !provider.isApproved) {
      return null;
    }

    return provider;
  }

  async loginProvider(provider: Provider): Promise<{ accessToken: string }> {
    const payload = { email: provider.email, sub: provider.id };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async approveProvider(id: number): Promise<Provider> {
    const provider = await this.providersRepository.findOne({ where: { id } });
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }
    provider.isApproved = true;
    return this.providersRepository.save(provider);
  }

}
