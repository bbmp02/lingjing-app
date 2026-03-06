import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ default: 'stranger' })
  relationshipLevel: string; // stranger, acquaintance, friend, confidant, ally

  // 道德维度评分
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  moralScore: number;

  // 修行维度评分
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  cultivationScore: number;

  // 社交维度评分
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  socialScore: number;

  // 精神货币余额
  @Column({ type: 'decimal', precision: 20, scale: 2, default: 0 })
  spiritCurrency: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
