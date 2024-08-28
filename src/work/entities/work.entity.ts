import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Contract } from 'src/contract/entities/contract.entity';
import { Worker } from 'src/worker/entities/worker.entity';
import { Review } from 'src/review/entities/review.entity';

@Entity()
export class Work {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Contract, contract => contract.works)
  contract: Contract;

  @ManyToMany(() => Worker)
  @JoinTable()  // 중간 테이블을 사용해 Many-to-Many 관계 설정
  workers: Worker[];

  @OneToMany(() => Review, review => review.work)
  reviews: Review[];

  @Column()
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ default: 'pending' })
  status: string; // 'pending', 'in-progress', 'completed'
}
