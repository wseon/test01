import { Controller, Post, Body, Get, Req, UseGuards, Delete, HttpCode, HttpStatus, Patch, Param, UsePipes, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

import { RegisterClientDto } from './dto/register-client.dto';
import { LoginClientDto } from './dto/login-client.dto';
import { RegisterBrokerDto } from './dto/register-broker.dto';

import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { Client } from './entities/client.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('test')
  test() {
    return true
  }

  @Post('register/client')
  async registerClient(@Body() registerClientDto: RegisterClientDto): Promise<Client> {
    return this.authService.registerClient(registerClientDto);
  }

  @Post('login/client')
  async loginClient(@Body() loginClientDto: LoginClientDto): Promise<{ accessToken: string }> {
    return this.authService.loginClient(loginClientDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {

  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth(@Req() req) {

  }

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthRedirect(@Req() req) {
    return this.authService.kakaoLogin(req);
  }

  @Delete('delete/client')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAccount(@Req() req) {
    await this.authService.deleteClientAccount(req.user.id);
  }

  @Post('register/broker')
  @UsePipes(ValidationPipe)
  async registerBroker(@Body() registerDto: RegisterBrokerDto) {
    return this.authService.registerBroker(registerDto);
  }

  @Post('login/broker')
  async loginBroker(@Body() loginDto: any) {
    const broker = await this.authService.validateBroker(loginDto.email, loginDto.password);
    if (!broker) {
      throw new UnauthorizedException('Invalid credentials or not approved');
    }
    return this.authService.loginBroker(broker);
  }

  @Patch(':id/approve/broker')
  async approveBroker(@Param('id') id: number) {
    return this.authService.approveBroker(id);
  }

}
