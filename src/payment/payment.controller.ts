import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { ProcessCommissionDto } from './dto/process-commission.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('process')
  processPayment(@Body() paymentDto: ProcessPaymentDto) {
    return this.paymentService.processPayment(paymentDto);
  }

  @Post('commission')
  processCommission(@Body() commissionDto: ProcessCommissionDto) {
    return this.paymentService.processCommission(commissionDto);
  }
}
