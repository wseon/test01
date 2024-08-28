import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Review } from './review.entity';
import { Broker } from 'src/auth/entities/broker.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Review, review => review.comments)
  review: Review;

  @ManyToOne(() => Broker, broker => broker.comments)
  broker: Broker;  // 댓글을 작성하는 브로커

  @Column('text')
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
