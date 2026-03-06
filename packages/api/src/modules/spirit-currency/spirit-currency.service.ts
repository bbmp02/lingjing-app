import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpiritTransaction, TransactionType } from './spirit-transaction.entity';
import { CreateTransactionDto, QueryTransactionDto } from './dto/spirit-currency.dto';
import { User } from '../user/user.entity';

@Injectable()
export class SpiritCurrencyService {
  constructor(
    @InjectRepository(SpiritTransaction)
    private transactionRepository: Repository<SpiritTransaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createTransaction(fromUserId: string, dto: CreateTransactionDto): Promise<SpiritTransaction> {
    // 检查接收者是否存在
    const toUser = await this.userRepository.findOne({ where: { id: dto.toUserId } });
    if (!toUser) {
      throw new NotFoundException('接收用户不存在');
    }

    // 检查发送者余额是否足够
    const fromUser = await this.userRepository.findOne({ where: { id: fromUserId } });
    if (!fromUser) {
      throw new NotFoundException('发送用户不存在');
    }

    if (Number(fromUser.spiritCurrency) < dto.amount) {
      throw new Error('精神货币余额不足');
    }

    // 创建交易记录
    const transaction = this.transactionRepository.create({
      amount: dto.amount,
      type: dto.type,
      description: dto.description,
      fromUserId,
      toUserId: dto.toUserId,
    });

    // 更新双方余额
    fromUser.spiritCurrency = Number(fromUser.spiritCurrency) - dto.amount;
    toUser.spiritCurrency = Number(toUser.spiritCurrency) + dto.amount;

    await this.userRepository.save([fromUser, toUser]);

    return this.transactionRepository.save(transaction);
  }

  async getTransactions(query: QueryTransactionDto) {
    const { userId, type, page = 1, limit = 20 } = query;

    const where: any = {};
    if (userId) {
      where.fromUserId = userId;
    }
    if (type) {
      where.type = type;
    }

    const [transactions, total] = await this.transactionRepository.findAndCount({
      where,
      relations: ['fromUser', 'toUser'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserBalance(userId: string): Promise<number> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return Number(user.spiritCurrency);
  }

  async getTransactionById(id: string): Promise<SpiritTransaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['fromUser', 'toUser'],
    });
    if (!transaction) {
      throw new NotFoundException('交易记录不存在');
    }
    return transaction;
  }
}
