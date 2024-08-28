import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OrderApplication } from 'src/order/entities/order-application.entity';
import { Worker } from 'src/worker/entities/worker.entity';

@Entity()
export class Provider {
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

  @Column('decimal', { default: 0 })  // 수행업체의 잔고 필드 추가
  balance: number;

  @OneToMany(() => OrderApplication, application => application.provider)
  applications: OrderApplication[]; // 수행업체 지원 리스트

  @OneToMany(() => Worker, worker => worker.provider)
  workers: Worker[]; // 수행업체의 작업자 리스트
}
