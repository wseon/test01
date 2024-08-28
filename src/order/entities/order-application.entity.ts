import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Provider } from 'src/auth/entities/provider.entity';

@Entity()
export class OrderApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.applications)
  order: Order;

  @ManyToOne(() => Provider, provider => provider.applications)
  provider: Provider;

  @Column('decimal', { precision: 10, scale: 2 })
  bidAmount: number; // 수행업체가 제시한 금액

  @Column({ default: 'pending' })
  status: string; // 예: 'pending', 'accepted', 'rejected'

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
