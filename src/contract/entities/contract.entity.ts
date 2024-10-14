import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany  } from 'typeorm';
import { Broker } from 'src/auth/entities/broker.entity';
import { Client } from 'src/auth/entities/client.entity';
import { Request } from 'src/request/entities/request.entity';
import { Work } from 'src/work/entities/work.entity';

@Entity()
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Request, request => request.contracts)
  request: Request;

  @ManyToOne(() => Broker, broker => broker.contracts)
  broker: Broker;

  @ManyToOne(() => Client, client => client.contracts)
  client: Client;

  @OneToMany(() => Work, work => work.contract)
  works: Work[];

  @Column()
  contractDetails: string;

  @Column({ default: false })
  brokerAgreed: boolean; // 브로커 동의 여부

  @Column({ default: false })
  clientAgreed: boolean; // 클라이언트 동의 여부

  @Column({ default: 'pending' }) // (default) pending, drafted, requested, completed
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
