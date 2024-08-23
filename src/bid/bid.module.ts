import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './entities/bid.entity';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { Broker } from 'src/broker/entities/broker.entity';
import { Request } from 'src/request/entities/request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bid, Broker, Request])],
  providers: [BidService],
  controllers: [BidController],
})
export class BidModule {}
