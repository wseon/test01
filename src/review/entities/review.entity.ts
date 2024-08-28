import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Client } from 'src/auth/entities/client.entity';
import { Work } from 'src/work/entities/work.entity';
import { Broker } from 'src/auth/entities/broker.entity';
import { Comment } from './comment.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, client => client.reviews)
  client: Client;

  @ManyToOne(() => Work, work => work.reviews)
  work: Work;

  @ManyToOne(() => Broker, broker => broker.reviews)
  broker: Broker;  // 리뷰가 브로커와 연관됨

  @Column('text')
  content: string;

  @Column('decimal', { precision: 2, scale: 1 })
  rating: number;  // 평점

  @OneToMany(() => Comment, comment => comment.review)
  comments: Comment[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
