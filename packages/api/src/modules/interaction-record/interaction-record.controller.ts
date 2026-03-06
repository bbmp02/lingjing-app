import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { InteractionRecordService } from './interaction-record.service';
import { CreateInteractionRecordDto, QueryInteractionRecordDto } from './dto/interaction-record.dto';

@Controller('interaction-records')
export class InteractionRecordController {
  constructor(
    private readonly interactionRecordService: InteractionRecordService,
  ) {}

  /**
   * 创建互动记录
   */
  @Post()
  async create(
    @Body() createInteractionRecordDto: CreateInteractionRecordDto & { userId: string },
  ) {
    return await this.interactionRecordService.create(
      createInteractionRecordDto.userId,
      createInteractionRecordDto,
    );
  }

  /**
   * 查询互动记录列表
   */
  @Get()
  async findAll(
    @Query() query: QueryInteractionRecordDto & { userId: string },
  ) {
    return await this.interactionRecordService.findAll(query.userId, query);
  }

  /**
   * 获取互动统计
   */
  @Get('statistics')
  async getStatistics(
    @Query('userId') userId: string,
    @Query('targetUserId') targetUserId?: string,
  ) {
    return await this.interactionRecordService.getStatistics(userId, targetUserId);
  }

  /**
   * 获取单条互动记录
   */
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ) {
    return await this.interactionRecordService.findOne(id, userId);
  }

  /**
   * 删除互动记录
   */
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ) {
    await this.interactionRecordService.remove(id, userId);
    return { message: '互动记录已删除' };
  }
}
