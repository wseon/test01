import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany } from 'typeorm';
import { Broker } from 'src/auth/entities/broker.entity';

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

  @ManyToOne(() => Broker, broker => broker.workers)
  broker: Broker;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
