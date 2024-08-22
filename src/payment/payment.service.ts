import { Injectable } from '@nestjs/common';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { ProcessCommissionDto } from './dto/process-commission.dto';

@Injectable()
export class PaymentService {
  processPayment(paymentDto: ProcessPaymentDto) {
    // 결제 처리 로직 구현
  }

  processCommission(commissionDto: ProcessCommissionDto) {
    // 수수료 처리 로직 구현
  }
}
