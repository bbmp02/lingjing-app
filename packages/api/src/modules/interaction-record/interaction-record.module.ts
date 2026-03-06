import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InteractionRecord } from './interaction-record.entity';
import { InteractionRecordService } from './interaction-record.service';
import { InteractionRecordController } from './interaction-record.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InteractionRecord])],
  providers: [InteractionRecordService],
  controllers: [InteractionRecordController],
  exports: [InteractionRecordService],
})
export class InteractionRecordModule {}
