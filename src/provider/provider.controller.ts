import { Controller, Post, Body, Patch, Param, UsePipes, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { RegisterProviderDto } from './dto/register-provider.dto';

@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() registerDto: RegisterProviderDto) {
    return this.providerService.registerProvider(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: any) {
    const provider = await this.providerService.validateProvider(loginDto.email, loginDto.password);
    if (!provider) {
      throw new UnauthorizedException('Invalid credentials or not approved');
    }
    return this.providerService.loginProvider(provider);
  }

  @Patch(':id/approve')
  async approveProvider(@Param('id') id: number) {
    return this.providerService.approveProvider(id);
  }
}
