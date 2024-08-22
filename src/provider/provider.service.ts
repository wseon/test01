import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from './entities/provider.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterProviderDto } from './dto/register-provider.dto';

import * as bcrypt from 'bcrypt';


@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(Provider)
    private providersRepository: Repository<Provider>,
    private jwtService: JwtService,
  ) {}

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
