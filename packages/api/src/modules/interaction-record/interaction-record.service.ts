import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { InteractionRecord, InteractionType, InteractionDirection } from './interaction-record.entity';
import { CreateInteractionRecordDto, QueryInteractionRecordDto } from './dto/interaction-record.dto';

@Injectable()
export class InteractionRecordService {
  constructor(
    @InjectRepository(InteractionRecord)
    private readonly interactionRecordRepository: Repository<InteractionRecord>,
  ) {}

  async create(userId: string, dto: CreateInteractionRecordDto): Promise<InteractionRecord> {
    const record = this.interactionRecordRepository.create({
      userId,
      targetUserId: dto.targetUserId,
      interactionType: dto.interactionType,
      direction: dto.direction,
      content: dto.content,
      quantity: dto.quantity || 1,
      spiritValue: dto.spiritValue || 0,
      metadata: dto.metadata,
    });

    return await this.interactionRecordRepository.save(record);
  }

  async findAll(userId: string, query: QueryInteractionRecordDto): Promise<{ data: InteractionRecord[]; total: number }> {
    const where: FindOptionsWhere<InteractionRecord> = {
      userId,
    };

    if (query.targetUserId) {
      where.targetUserId = query.targetUserId;
    }

    if (query.interactionType) {
      where.interactionType = query.interactionType;
    }

    if (query.direction) {
      where.direction = query.direction;
    }

    let dateFilter: any = undefined;
    if (query.startDate && query.endDate) {
      dateFilter = Between(new Date(query.startDate), new Date(query.endDate));
    }

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await this.interactionRecordRepository.findAndCount({
      where: {
        ...where,
        createdAt: dateFilter,
      },
      relations: ['targetUser'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return { data, total };
  }

  async findOne(id: string, userId: string): Promise<InteractionRecord> {
    const record = await this.interactionRecordRepository.findOne({
      where: { id, userId },
      relations: ['targetUser'],
    });

    if (!record) {
      throw new NotFoundException(`互动记录 #${id} 不存在`);
    }

    return record;
  }

  async getStatistics(userId: string, targetUserId?: string): Promise<any> {
    const where: FindOptionsWhere<InteractionRecord> = { userId };
    if (targetUserId) {
      where.targetUserId = targetUserId;
    }

    // 按互动类型统计
    const byType = await this.interactionRecordRepository
      .createQueryBuilder('record')
      .select('record.interactionType', 'type')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(record.quantity)', 'totalQuantity')
      .addSelect('SUM(record.spiritValue)', 'totalSpiritValue')
      .where('record.userId = :userId', { userId })
      .groupBy('record.interactionType')
      .getRawMany();

    // 按方向统计
    const byDirection = await this.interactionRecordRepository
      .createQueryBuilder('record')
      .select('record.direction', 'direction')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(record.spiritValue)', 'totalSpiritValue')
      .where('record.userId = :userId', { userId })
      .groupBy('record.direction')
      .getRawMany();

    // 汇总
    const summary = await this.interactionRecordRepository
      .createQueryBuilder('record')
      .select('COUNT(*)', 'totalInteractions')
      .addSelect('SUM(record.quantity)', 'totalQuantity')
      .addSelect('SUM(record.spiritValue)', 'totalSpiritValue')
      .where('record.userId = :userId', { userId })
      .getRawOne();

    return {
      summary,
      byType,
      byDirection,
    };
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.interactionRecordRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException(`互动记录 #${id} 不存在`);
    }
  }
}
