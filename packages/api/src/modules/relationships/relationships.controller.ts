import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { RelationshipsService } from './relationships.service';
import { CreateRelationshipDto, UpdateRelationshipDto, RecordInteractionDto } from './dto/relationships.dto';

// TODO: 添加 AuthGuard
// @UseGuards(AuthGuard)

@Controller('relationships')
export class RelationshipsController {
  constructor(private readonly relationshipsService: RelationshipsService) {}

  /**
   * GET /relationships
   * 获取当前用户的所有关系
   */
  @Get()
  async findAll(@Query('userId') userId: string) {
    return this.relationshipsService.findAll(userId);
  }

  /**
   * GET /relationships/:id
   * 获取指定关系详情
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // TODO: 从 auth 获取 userId
    const userId = 'default-user-id';
    const relationship = await this.relationshipsService.findOne(userId, id);
    return relationship;
  }

  /**
   * POST /relationships
   * 建立新关系
   */
  @Post()
  async create(@Body() dto: CreateRelationshipDto) {
    // TODO: 从 auth 获取 userId
    const userId = 'default-user-id';
    return this.relationshipsService.create(userId, dto);
  }

  /**
   * PATCH /relationships/:id
   * 更新关系
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRelationshipDto) {
    return this.relationshipsService.update(id, dto);
  }

  /**
   * POST /relationships/:id/interaction
   * 记录互动
   */
  @Post(':id/interaction')
  async recordInteraction(@Param('id') id: string, @Body() dto: RecordInteractionDto) {
    return this.relationshipsService.recordInteraction(id, dto);
  }

  /**
   * DELETE /relationships/:id
   * 删除关系
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.relationshipsService.remove(id);
  }
}
