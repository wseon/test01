import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';
import { Request } from 'src/request/entities/request.entity';

@Entity()
@Unique(['email'])
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  kakaoId?: string;

  @Column()
  name: string;

  @Column()
  authProvider: 'email' | 'google' | 'kakao';

  @OneToMany(() => Request, request => request.client)
  requests: Request[];

}
