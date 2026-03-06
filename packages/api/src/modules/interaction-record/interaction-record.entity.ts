import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

export enum InteractionType {
  MESSAGE = 'message',           // 消息
  VOICE_CALL = 'voice_call',    // 语音通话
  VIDEO_CALL = 'video_call',    // 视频通话
  GIFT = 'gift',                 // 送礼物
  PRAISE = 'praise',             // 点赞/表扬
  CRITICIZE = 'criticize',       // 批评
  SHARE = 'share',               // 分享内容
  GAME = 'game',                 // 一起玩游戏
  MEET = 'meet',                 // 线下见面
  OTHER = 'other',               // 其他
}

export enum InteractionDirection {
  SEND = 'send',     // 发出互动
  RECEIVE = 'receive', // 接收互动
}

@Entity('interaction_records')
export class InteractionRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'target_user_id' })
  targetUser: User;

  @Column()
  targetUserId: string;

  @Column({ type: 'varchar', default: InteractionType.MESSAGE })
  interactionType: InteractionType;

  @Column({ type: 'varchar', default: InteractionDirection.SEND })
  direction: InteractionDirection;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'int', default: 1 })
  quantity: number; // 互动数量（如发送消息数）

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  spiritValue: number; // 精神价值

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>; // 附加数据

  @CreateDateColumn()
  createdAt: Date;
}
