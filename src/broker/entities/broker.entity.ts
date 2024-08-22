import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

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
}
