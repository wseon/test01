import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Request } from 'src/request/entities/request.entity';
import { Broker } from 'src/broker/entities/broker.entity';

@Entity()
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  amount: number;  // 견적 금액

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Broker, broker => broker.bids)
  broker: Broker;

  @ManyToOne(() => Request, request => request.bids)
  request: Request;

  @Column({ default: false })
  isAccepted: boolean;  // 견적 수락 여부

  
}
