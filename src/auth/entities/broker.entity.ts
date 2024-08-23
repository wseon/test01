import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';
import { Bid } from 'src/bid/entities/bid.entity';

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

  @OneToMany(() => Bid, bid => bid.broker) // 새로운 필드 추가
  bids: Bid[];
}
