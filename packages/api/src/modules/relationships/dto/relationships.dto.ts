import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateRelationshipDto {
  @IsString()
  targetUserId: string;

  @IsOptional()
  @IsString()
  relationshipType?: string;
}

export class UpdateRelationshipDto {
  @IsOptional()
  @IsString()
  relationshipType?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  relationshipStrength?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  trustScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  cooperationScore?: number;
}

export class RecordInteractionDto {
  @IsString()
  interactionType: string; // message, help, collaboration, gift, endorsement

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  strengthChange?: number; // 本次互动带来的关系强度变化
}
