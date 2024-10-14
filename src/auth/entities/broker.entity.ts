import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';
import { Bid } from 'src/bid/entities/bid.entity';
import { Contract } from 'src/contract/entities/contract.entity';
import { Review } from 'src/review/entities/review.entity';
import { Comment } from 'src/review/entities/comment.entity';
import { Worker } from 'src/worker/entities/worker.entity';

@Entity()
@Unique(['businessNumber'])
export class Broker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  businessNumber: string; // 사업자 번호

  @Column({ default: false })
  isApproved: boolean; // 승인 여부

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column('decimal', { default: 0 })  // 브로커의 잔고 필드 추가
  balance: number;

  @OneToMany(() => Bid, bid => bid.broker)
  bids: Bid[];

  @OneToMany(() => Contract, contract => contract.broker)
  contracts: Contract[];

  @OneToMany(() => Review, review => review.broker)
  reviews: Review[];

  @OneToMany(() => Comment, comment => comment.broker)
  comments: Comment[];

  @OneToMany(() => Worker, worker => worker.broker)
  workers: Worker[];

}
