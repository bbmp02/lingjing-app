import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Relationship, RelationshipType } from './relationships.entity';
import { CreateRelationshipDto, UpdateRelationshipDto, RecordInteractionDto } from './dto/relationships.dto';

@Injectable()
export class RelationshipsService {
  constructor(
    @InjectRepository(Relationship)
    private relationshipsRepository: Repository<Relationship>,
  ) {}

  /**
   * 获取当前用户的所有关系
   */
  async findAll(userId: string): Promise<Relationship[]> {
    return this.relationshipsRepository.find({
      where: { userId },
      relations: ['targetUser'],
      order: { relationshipStrength: 'DESC' },
    });
  }

  /**
   * 获取与指定用户的关系
   */
  async findOne(userId: string, targetUserId: string): Promise<Relationship | null> {
    return this.relationshipsRepository.findOne({
      where: { userId, targetUserId },
      relations: ['targetUser'],
    });
  }

  /**
   * 建立新关系
   */
  async create(userId: string, dto: CreateRelationshipDto): Promise<Relationship> {
    // 检查是否已存在关系
    const existing = await this.findOne(userId, dto.targetUserId);
    if (existing) {
      throw new ConflictException('Relationship already exists');
    }

    const relationship = this.relationshipsRepository.create({
      userId,
      targetUserId: dto.targetUserId,
      relationshipType: dto.relationshipType as RelationshipType || RelationshipType.STRANGER,
      relationshipStrength: 0,
      trustScore: 0,
      cooperationScore: 0,
      interactionCount: 0,
    });

    return this.relationshipsRepository.save(relationship);
  }

  /**
   * 更新关系
   */
  async update(id: string, dto: UpdateRelationshipDto): Promise<Relationship> {
    const relationship = await this.relationshipsRepository.findOne({ where: { id } });
    if (!relationship) {
      throw new NotFoundException('Relationship not found');
    }

    // 自动升级关系类型
    if (dto.relationshipStrength !== undefined) {
      relationship.relationshipStrength = dto.relationshipStrength;
      relationship.relationshipType = this.calculateRelationshipType(dto.relationshipStrength);
    }

    if (dto.relationshipType) {
      relationship.relationshipType = dto.relationshipType as RelationshipType;
    }

    if (dto.trustScore !== undefined) {
      relationship.trustScore = dto.trustScore;
    }

    if (dto.cooperationScore !== undefined) {
      relationship.cooperationScore = dto.cooperationScore;
    }

    return this.relationshipsRepository.save(relationship);
  }

  /**
   * 记录互动，自动更新关系强度
   */
  async recordInteraction(id: string, dto: RecordInteractionDto): Promise<Relationship> {
    const relationship = await this.relationshipsRepository.findOne({ where: { id } });
    if (!relationship) {
      throw new NotFoundException('Relationship not found');
    }

    // 更新互动统计
    relationship.interactionCount += 1;
    relationship.lastInteractionAt = new Date();

    // 计算关系强度变化
    const baseChange = this.getInteractionStrengthChange(dto.interactionType);
    const strengthChange = dto.strengthChange ?? baseChange;
    
    // 更新关系强度 (不超过 100)
    relationship.relationshipStrength = Math.min(
      100,
      Math.max(0, Number(relationship.relationshipStrength) + strengthChange)
    );

    // 自动升级关系类型
    relationship.relationshipType = this.calculateRelationshipType(
      relationship.relationshipStrength
    );

    return this.relationshipsRepository.save(relationship);
  }

  /**
   * 根据关系强度计算关系类型
   */
  private calculateRelationshipType(strength: number): RelationshipType {
    if (strength >= 80) return RelationshipType.ALLY;
    if (strength >= 60) return RelationshipType.CONFIDANT;
    if (strength >= 40) return RelationshipType.FRIEND;
    if (strength >= 20) return RelationshipType.ACQUAINTANCE;
    return RelationshipType.STRANGER;
  }

  /**
   * 获取不同互动类型的基础强度变化
   */
  private getInteractionStrengthChange(type: string): number {
    const changes: Record<string, number> = {
      message: 1,
      help: 3,
      collaboration: 5,
      gift: 4,
      endorsement: 3,
      other: 1,
    };
    return changes[type] || 1;
  }

  /**
   * 删除关系
   */
  async remove(id: string): Promise<void> {
    const relationship = await this.relationshipsRepository.findOne({ where: { id } });
    if (!relationship) {
      throw new NotFoundException('Relationship not found');
    }
    await this.relationshipsRepository.remove(relationship);
  }
}
