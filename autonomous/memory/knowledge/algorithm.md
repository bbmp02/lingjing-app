# 灵境APP - 自主模式知识库

## 📊 核心数据结构

### 用户 (User)
```typescript
{
  id: string;              // UUID
  username: string;        // 用户名
  email: string;           // 邮箱
  password: string;        // 加密密码
  nickname?: string;       // 昵称
  relationshipLevel: RelationshipType;  // 关系等级
  moralScore: number;      // 道德分 (0-100)
  cultivationScore: number; // 修行分 (0-100)
  socialScore: number;     // 社交分 (0-100)
  spiritCurrency: number;   // 精神货币余额
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 关系 (Relationship)
```typescript
{
  id: string;
  userId: string;
  targetUserId: string;
  relationshipType: RelationshipType;  // stranger/acquaintance/friend/confidant/ally
  relationshipStrength: number;          // 0-100
  trustScore: number;                   // 信任度
  cooperationScore: number;             // 合作度
  interactionCount: number;             // 互动次数
  lastInteractionAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 互动记录 (InteractionRecord)
```typescript
{
  id: string;
  userId: string;
  targetUserId: string;
  interactionType: InteractionType;  // chat/gift/help/share/discuss
  content?: string;
  emotion?: Emotion;                // happy/sad/angry/neutral/excited/worried/grateful
  quantity: number;                // 数量
  spiritValue: number;              // 精神价值
  direction: 'send' | 'receive';
  metadata?: Record<string, any>;
  createdAt: Date;
}
```

### 精神货币交易 (SpiritTransaction)
```typescript
{
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  type: TransactionType;  // reward/gift/trade/investment/punishment
  reason?: string;
  createdAt: Date;
}
```

---

## 🧮 核心算法

### 1. 道德分计算
```
道德分 = (善良度×0.3 + 诚实度×0.3 + 公正度×0.2 + 责任感×0.2)

善良度: 帮助他人次数/质量
诚实度: 言行一致性
公正度: 决策公平性
责任感: 承诺履行率
```

### 2. 修行分计算
```
修行分 = (格物度×0.25 + 致知度×0.25 + 诚意度×0.25 + 正心度×0.25)

格物度: 探索世界深度
致知度: 知识积累/分享
诚意度: 意念纯净度
正心度: 情绪稳定性
```

### 3. 社交分计算
```
社交分 = (信任度×0.3 + 合作度×0.3 + 贡献度×0.2 + 影响力×0.2)

信任度: 被信任次数
合作度: 协作成功率
贡献度: 社区贡献值
影响力: 正面影响范围
```

### 4. 关系强度算法
```
关系强度 = (互动频率×0.3 + 信任度×0.4 + 共同目标×0.3)

关系升级阈值:
- stranger → acquaintance: 10
- acquaintance → friend: 100
- friend → confidant: 500
- confidant → ally: 1000
```

### 5. 精神货币发行
```
每日发行: 100 SC
分配:
- 道德分前10%: 30 SC
- 修行分前10%: 30 SC
- 社交分前10%: 30 SC
- 社区池: 10 SC
```

### 6. 资源分配权重
```
分配权重 = (SC×0.4 + 道德分×0.3 + 贡献度×0.3)
个人份额 = 总资源 × (个人权重 / 总权重)
```

---

## 🔗 关系类型权限

| 等级 | 类型 | 权限 |
|------|------|------|
| 0 | stranger | 基础交互 |
| 1 | acquaintance | 消息优先 |
| 2 | friend | 资源共享 |
| 3 | confidant | 深度协作 |
| 4 | ally | 财产共管 |

---

## 💰 精神货币获取

| 行为 | 奖励 |
|------|------|
| 帮助他人 | +1~10 SC |
| 知识分享 | +1~5 SC |
| 完成修行任务 | +5~20 SC |
| 建立优质关系 | +2~10 SC |
| 社区贡献 | +1~50 SC |

---

## 💸 精神货币消耗

| 用途 | 消耗 |
|------|------|
| 请求帮助 | 1~10 SC |
| 建立深度关系 | 10~100 SC |
| 兑换资源 | 100~10000 SC |
| 参与治理投票 | 10~100 SC |

---

## 📁 文件位置

- 算法服务: `packages/api/src/modules/algorithm/algorithm.service.ts`
- 用户实体: `packages/api/src/modules/user/user.entity.ts`
- 关系实体: `packages/api/src/modules/relationships/relationships.entity.ts`
- 互动记录: `packages/api/src/modules/interaction-record/interaction-record.entity.ts`
- 算法文档: `docs/灵境 APP- 精神货币框架.md`

---

## 🔄 持续更新
最后更新: 2026-03-09

## 📝 向墨衍学习
遇到算法问题可以向墨衍（AI上司）寻求指导：
- 墨衍邮箱: 6295775@qq.com
- 职责: 代码Review + 算法优化指导
