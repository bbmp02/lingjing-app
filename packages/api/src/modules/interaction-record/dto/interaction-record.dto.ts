import { IsString, IsEnum, IsOptional, IsNumber, IsUUID, IsObject } from 'class-validator';
import { InteractionType, InteractionDirection } from '../interaction-record.entity';

export class CreateInteractionRecordDto {
  @IsUUID()
  targetUserId: string;

  @IsEnum(InteractionType)
  interactionType: InteractionType;

  @IsEnum(InteractionDirection)
  direction: InteractionDirection;

  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @IsOptional()
  spiritValue?: number;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class QueryInteractionRecordDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  @IsOptional()
  targetUserId?: string;

  @IsEnum(InteractionType)
  @IsOptional()
  interactionType?: InteractionType;

  @IsEnum(InteractionDirection)
  @IsOptional()
  direction?: InteractionDirection;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}
