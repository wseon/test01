import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Client } from 'src/auth/entities/client.entity';
import { Broker } from 'src/auth/entities/broker.entity';
import { Bid } from 'src/bid/entities/bid.entity';
import { Contract } from 'src/contract/entities/contract.entity';

@Entity()
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Client, client => client.requests)
  client: Client;

  @ManyToOne(() => Broker, { nullable: true })
  broker: Broker;

  @Column({ default: false })
  isPublic: boolean; // 공개 여부 (true: 공개, false: 특정 Broker에게 요청)

  @OneToMany(() => Bid, bid => bid.request) // 새로운 필드 추가
  bids: Bid[];

  @OneToMany(() => Contract, contract => contract.request)
  contracts: Contract[]; // 새로운 필드 추가
}
