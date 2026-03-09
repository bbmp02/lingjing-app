import { Controller, Get, Param, Query } from '@nestjs/common';
import { AlgorithmService } from './algorithm.service';

@Controller('algorithm')
export class AlgorithmController {
  constructor(private readonly algorithmService: AlgorithmService) {}

  /**
   * 获取用户道德分
   */
  @Get('morality/:userId')
  getMoralityScore(@Param('userId') userId: string) {
    return this.algorithmService.calculateMoralityScore(userId);
  }

  /**
   * 获取用户修行分
   */
  @Get('cultivation/:userId')
  getCultivationScore(@Param('userId') userId: string) {
    return this.algorithmService.calculateCultivationScore(userId);
  }

  /**
   * 获取用户社交分
   */
  @Get('social/:userId')
  getSocialScore(@Param('userId') userId: string) {
    return this.algorithmService.calculateSocialScore(userId);
  }

  /**
   * 获取用户所有分数
   */
  @Get('scores/:userId')
  getAllScores(@Param('userId') userId: string) {
    const morality = this.algorithmService.calculateMoralityScore(userId);
    const cultivation = this.algorithmService.calculateCultivationScore(userId);
    const social = this.algorithmService.calculateSocialScore(userId);

    return {
      userId,
      morality,
      cultivation,
      social,
      totalScore: Math.round((morality.total + cultivation.total + social.total) / 3 * 100) / 100,
    };
  }

  /**
   * 计算关系强度
   */
  @Get('relationship-strength')
  async getRelationshipStrength(
    @Query('userId') userId: string,
    @Query('targetUserId') targetUserId: string,
  ) {
    return this.algorithmService.calculateRelationshipStrengthFull(userId, targetUserId);
  }

  /**
   * 获取每日发行信息
   */
  @Get('daily-mint')
  getDailyMint() {
    return this.algorithmService.calculateDailyMint();
  }

  /**
   * 计算资源分配权重
   */
  @Get('resource-weight')
  getResourceWeight(
    @Query('spiritCurrency') spiritCurrency: string,
    @Query('moralScore') moralScore: string,
    @Query('contributionScore') contributionScore: string,
  ) {
    return {
      weight: this.algorithmService.calculateResourceWeight(
        Number(spiritCurrency) || 0,
        Number(moralScore) || 0,
        Number(contributionScore) || 0,
      ),
    };
  }
}
