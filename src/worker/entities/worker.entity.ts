import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Provider } from 'src/auth/entities/provider.entity';

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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
