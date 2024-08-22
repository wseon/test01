import { Controller, Post, Body, Patch, Param, UsePipes, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { BrokerService } from './broker.service';
import { RegisterBrokerDto } from './dto/register-broker.dto';

@Controller('broker')
export class BrokerController {
  constructor(private readonly brokerService: BrokerService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() registerDto: RegisterBrokerDto) {
    console.log('DDDD')
    console.log(registerDto)
    return this.brokerService.registerBroker(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: any) {
    const broker = await this.brokerService.validateBroker(loginDto.email, loginDto.password);
    if (!broker) {
      throw new UnauthorizedException('Invalid credentials or not approved');
    }
    return this.brokerService.loginBroker(broker);
  }

  @Patch(':id/approve')
  async approveBroker(@Param('id') id: number) {
    return this.brokerService.approveBroker(id);
  }
}
