import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Relationship, RelationshipType } from '../relationships/relationships.entity';
import { InteractionRecord } from '../interaction-record/interaction-record.entity';

/**
 * 灵境核心算法服务
 * 实现道德分、修行分、社交分、关系强度等计算
 */
@Injectable()
export class AlgorithmService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Relationship)
    private relationshipRepository: Repository<Relationship>,
    @InjectRepository(InteractionRecord)
    private interactionRepository: Repository<InteractionRecord>,
  ) {}

  // ==================== 道德分计算 ====================
  /**
   * 计算道德分
   * 公式: 道德分 = (善良×0.3 + 诚实×0.3 + 公正×0.2 + 责任×0.2)
   */
  calculateMoralityScore(userId: string): { total: number; breakdown: MoralityBreakdown } {
    // 从互动记录中分析道德行为
    // 这里使用简化算法，实际需要更复杂的机器学习模型
    
    const breakdown: MoralityBreakdown = {
      kindness: this.calculateKindness(userId),
      honesty: this.calculateHonesty(userId),
      fairness: this.calculateFairness(userId),
      responsibility: this.calculateResponsibility(userId),
    };

    const total = 
      breakdown.kindness * 0.3 +
      breakdown.honesty * 0.3 +
      breakdown.fairness * 0.2 +
      breakdown.responsibility * 0.2;

    return { total: Math.round(total * 100) / 100, breakdown };
  }

  // 善良度：帮助他人次数/质量
  private calculateKindness(userId: string): number {
    // TODO: 从互动记录中统计帮助行为
    // 简化：随机生成一个基础分，后续根据真实数据调整
    return 70; // 默认值
  }

  // 诚实度：言行一致性
  private calculateHonesty(userId: string): number {
    // TODO: 分析用户历史言行
    return 75;
  }

  // 公正度：决策公平性
  private calculateFairness(userId: string): number {
    // TODO: 分析用户决策模式
    return 72;
  }

  // 责任感：承诺履行率
  private calculateResponsibility(userId: string): number {
    // TODO: 统计承诺完成情况
    return 68;
  }

  // ==================== 修行分计算 ====================
  /**
   * 计算修行分
   * 公式: 修行分 = (格物×0.25 + 致知×0.25 + 诚意×0.25 + 正心×0.25)
   */
  calculateCultivationScore(userId: string): { total: number; breakdown: CultivationBreakdown } {
    const breakdown: CultivationBreakdown = {
      exploration: this.calculateExploration(userId),    // 格物
      knowledge: this.calculateKnowledge(userId),        // 致知
      sincerity: this.calculateSincerity(userId),       // 诚意
      mindfulness: this.calculateMindfulness(userId),   // 正心
    };

    const total = 
      breakdown.exploration * 0.25 +
      breakdown.knowledge * 0.25 +
      breakdown.sincerity * 0.25 +
      breakdown.mindfulness * 0.25;

    return { total: Math.round(total * 100) / 100, breakdown };
  }

  private calculateExploration(userId: string): number {
    // TODO: 统计探索行为
    return 65;
  }

  private calculateKnowledge(userId: string): number {
    // TODO: 统计知识积累
    return 70;
  }

  private calculateSincerity(userId: string): number {
    // TODO: 分析意念纯净度
    return 68;
  }

  private calculateMindfulness(userId: string): number {
    // TODO: 分析情绪稳定性
    return 72;
  }

  // ==================== 社交分计算 ====================
  /**
   * 计算社交分
   * 公式: 社交分 = (信任×0.3 + 合作×0.3 + 贡献×0.2 + 影响×0.2)
   */
  calculateSocialScore(userId: string): { total: number; breakdown: SocialBreakdown } {
    const breakdown: SocialBreakdown = {
      trust: this.calculateTrust(userId),        // 信任度
      cooperation: this.calculateCooperation(userId), // 合作度
      contribution: this.calculateContribution(userId), // 贡献度
      influence: this.calculateInfluence(userId),  // 影响力
    };

    const total = 
      breakdown.trust * 0.3 +
      breakdown.cooperation * 0.3 +
      breakdown.contribution * 0.2 +
      breakdown.influence * 0.2;

    return { total: Math.round(total * 100) / 100, breakdown };
  }

  private calculateTrust(userId: string): number {
    // TODO: 统计被信任次数
    return 70;
  }

  private calculateCooperation(userId: string): number {
    // TODO: 统计协作成功率
    return 68;
  }

  private calculateContribution(userId: string): number {
    // TODO: 统计社区贡献值
    return 65;
  }

  private calculateInfluence(userId: string): number {
    // TODO: 分析正面影响范围
    return 60;
  }

  // ==================== 关系强度算法 ====================
  /**
   * 计算关系强度
   * 公式: 关系强度 = (互动频率×0.3 + 信任度×0.4 + 共同目标×0.3)
   */
  calculateRelationshipStrength(relationshipId: string): number {
    // TODO: 从数据库获取真实数据计算
    // 简化版：返回默认值
    return 50;
  }

  /**
   * 计算关系强度（完整版）
   */
  async calculateRelationshipStrengthFull(userId: string, targetUserId: string): Promise<{
    strength: number;
    frequency: number;
    trust: number;
    commonGoals: number;
  }> {
    // 获取关系记录
    const relationship = await this.relationshipRepository.findOne({
      where: { userId, targetUserId }
    });

    // 获取互动记录统计
    const interactions = await this.interactionRepository.count({
      where: { userId, targetUserId }
    });

    // 互动频率 (0-100)
    const frequency = Math.min(100, interactions * 10);

    // 信任度
    const trust = relationship?.trustScore || 50;

    // 共同目标 (简化)
    const commonGoals = 50;

    // 计算总强度
    const strength = frequency * 0.3 + trust * 0.4 + commonGoals * 0.3;

    return {
      strength: Math.round(strength * 100) / 100,
      frequency,
      trust,
      commonGoals,
    };
  }

  // ==================== 精神货币分配算法 ====================
  /**
   * 计算每日精神货币发行量
   * 基础发行 100 SC
   */
  calculateDailyMint(): { total: number; distribution: MintDistribution } {
    const total = 100;
    
    const distribution: MintDistribution = {
      moralityTop: 30,    // 道德分前10%
      cultivationTop: 30, // 修行分前10%
      socialTop: 30,      // 社交分前10%
      communityPool: 10,  // 社区池
    };

    return { total, distribution };
  }

  /**
   * 根据排名计算分配
   */
  calculateDistributionByRank(
    userRank: number, 
    totalUsers: number, 
    dailyAmount: number
  ): number {
    if (totalUsers === 0) return 0;
    
    const percentile = userRank / totalUsers;
    
    if (percentile <= 0.1) {
      // 前10%获得该类别全部
      return dailyAmount;
    } else if (percentile <= 0.3) {
      // 10-30%获得50%
      return dailyAmount * 0.5;
    } else if (percentile <= 0.5) {
      // 30-50%获得25%
      return dailyAmount * 0.25;
    }
    return 0;
  }

  // ==================== 资源分配权重算法 ====================
  /**
   * 计算资源分配权重
   * 公式: 分配权重 = (SC×0.4 + 道德分×0.3 + 贡献度×0.3)
   */
  calculateResourceWeight(
    spiritCurrency: number, 
    moralScore: number, 
    contributionScore: number
  ): number {
    const weight = 
      spiritCurrency * 0.4 +
      moralScore * 0.3 +
      contributionScore * 0.3;
    
    return Math.round(weight * 100) / 100;
  }

  /**
   * 计算个人可分配份额
   */
  calculatePersonalShare(
    personalWeight: number,
    totalWeights: number,
    totalResources: number
  ): number {
    if (totalWeights === 0) return 0;
    return (personalWeight / totalWeights) * totalResources;
  }

  // ==================== 关系升级算法 ====================
  /**
   * 检查并处理关系升级
   */
  async checkAndUpgradeRelationship(userId: string, targetUserId: string): Promise<{
    upgraded: boolean;
    newLevel: RelationshipType;
  }> {
    const strength = await this.calculateRelationshipStrengthFull(userId, targetUserId);
    
    let newLevel = RelationshipType.STRANGER;
    let upgraded = false;

    if (strength.strength >= 1000) {
      newLevel = RelationshipType.ALLY;
      upgraded = true;
    } else if (strength.strength >= 500) {
      newLevel = RelationshipType.CONFIDANT;
      upgraded = true;
    } else if (strength.strength >= 100) {
      newLevel = RelationshipType.FRIEND;
      upgraded = true;
    } else if (strength.strength >= 10) {
      newLevel = RelationshipType.ACQUAINTANCE;
      upgraded = true;
    }

    if (upgraded) {
      await this.relationshipRepository.update(
        { userId, targetUserId },
        { relationshipType: newLevel as RelationshipType }
      );
    }

    return { upgraded, newLevel };
  }
}

// 类型定义
export interface MoralityBreakdown {
  kindness: number;
  honesty: number;
  fairness: number;
  responsibility: number;
}

export interface CultivationBreakdown {
  exploration: number;
  knowledge: number;
  sincerity: number;
  mindfulness: number;
}

export interface SocialBreakdown {
  trust: number;
  cooperation: number;
  contribution: number;
  influence: number;
}

export interface MintDistribution {
  moralityTop: number;
  cultivationTop: number;
  socialTop: number;
  communityPool: number;
}
