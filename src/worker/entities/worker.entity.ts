import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany } from 'typeorm';
import { Provider } from 'src/auth/entities/provider.entity';
import { Order } from 'src/order/entities/order.entity';

@Entity()
export class Worker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @ManyToOne(() => Provider, provider => provider.workers)
  provider: Provider;

  @ManyToMany(() => Order, order => order.workers)
  orders: Order[];  // 작업자가 배정된 오더 리스트

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
