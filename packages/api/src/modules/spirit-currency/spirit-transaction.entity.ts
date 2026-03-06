import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

export enum TransactionType {
  REWARD = 'reward',      // 奖励
  TIP = 'tip',           // 打赏
  CONTRIBUTION = 'contribution', // 贡献
  TRADE = 'trade',       // 交易
  SYSTEM = 'system',     // 系统发放
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('spirit_transactions')
export class SpiritTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 20, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.COMPLETED })
  status: TransactionStatus;

  @Column({ nullable: true })
  description: string;

  @Column()
  fromUserId: string;

  @ManyToOne(() => User)
  fromUser: User;

  @Column()
  toUserId: string;

  @ManyToOne(() => User)
  toUser: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
