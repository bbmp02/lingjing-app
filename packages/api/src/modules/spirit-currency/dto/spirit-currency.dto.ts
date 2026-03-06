import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { TransactionType } from '../spirit-transaction.entity';

export class CreateTransactionDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  toUserId: string;
}

export class QueryTransactionDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsOptional()
  @IsNumber()
  @IsOptional()
  limit?: number;
}
