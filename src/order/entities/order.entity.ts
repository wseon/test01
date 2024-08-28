import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Contract } from 'src/contract/entities/contract.entity';
import { Broker } from 'src/auth/entities/broker.entity';
import { OrderApplication } from './order-application.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Contract, contract => contract.orders)
  contract: Contract;

  @ManyToOne(() => Broker, broker => broker.orders)
  broker: Broker;

  @OneToMany(() => OrderApplication, application => application.order)
  applications: OrderApplication[]; // 수행업체 지원 리스트

  @Column()
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: 'open' })
  status: string; // 예: 'open', 'closed'
}
