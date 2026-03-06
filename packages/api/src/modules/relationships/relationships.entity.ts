import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../user/user.entity';

export enum RelationshipType {
  STRANGER = 'stranger',
  ACQUAINTANCE = 'acquaintance',
  FRIEND = 'friend',
  CONFIDANT = 'confidant',
  ALLY = 'ally',
}

@Entity('relationships')
@Unique(['user', 'targetUser'])
export class Relationship {
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

  @Column({ type: 'varchar', default: RelationshipType.STRANGER })
  relationshipType: RelationshipType;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  relationshipStrength: number; // 0-100

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  trustScore: number; // 信任度

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  cooperationScore: number; // 合作度

  @Column({ default: 0 })
  interactionCount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastInteractionAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
