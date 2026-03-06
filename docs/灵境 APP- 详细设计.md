# 灵境 APP 详细设计 v0.1

> 灵境 (Spirit Realm) APP - 详细设计文档
> 
> 创建时间：2026-03-06 10:14  
> 版本：v0.1  
> 状态：方案 A 确认 (不上链)

---

## 一、数据库详细设计

### 1.1 核心表结构

```sql
-- ============================================
-- 用户表
-- ============================================
CREATE TABLE users (
  -- 基础信息
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  avatar_url VARCHAR(500),
  
  -- 精神货币
  spirit_coin_balance DECIMAL(20,8) DEFAULT 0,
  total_earned DECIMAL(20,8) DEFAULT 0,
  total_spent DECIMAL(20,8) DEFAULT 0,
  
  -- 三维度评分
  morality_score DECIMAL(5,2) DEFAULT 0,    -- 道德分 (0-100)
  cultivation_score DECIMAL(5,2) DEFAULT 0, -- 修行分 (0-100)
  social_score DECIMAL(5,2) DEFAULT 0,      -- 社交分 (0-100)
  
  -- 关系类型
  relationship_level VARCHAR(20) DEFAULT 'stranger' 
    CHECK (relationship_level IN ('stranger', 'acquaintance', 'friend', 'confidant', 'ally')),
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  
  -- 索引
  INDEX idx_users_username (username),
  INDEX idx_users_spirit_coin (spirit_coin_balance DESC),
  INDEX idx_users_morality (morality_score DESC)
);

-- ============================================
-- 关系表 (有向图)
-- ============================================
CREATE TABLE relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- 关系类型
  relationship_type VARCHAR(20) DEFAULT 'stranger'
    CHECK (relationship_type IN ('stranger', 'acquaintance', 'friend', 'confidant', 'ally')),
  
  -- 关系强度 (0-100)
  relationship_strength DECIMAL(5,2) DEFAULT 0,
  
  -- 子维度评分
  trust_score DECIMAL(5,2) DEFAULT 0,      -- 信任度
  cooperation_score DECIMAL(5,2) DEFAULT 0, -- 合作度
  
  -- 互动统计
  interaction_count INTEGER DEFAULT 0,
  last_interaction_at TIMESTAMP,
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- 约束
  UNIQUE(user_id, target_user_id),
  INDEX idx_relationships_user (user_id),
  INDEX idx_relationships_target (target_user_id),
  INDEX idx_relationships_type (relationship_type)
);

-- ============================================
-- 互动记录表
-- ============================================
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- 互动类型
  interaction_type VARCHAR(50) NOT NULL
    CHECK (interaction_type IN ('message', 'help', 'collaboration', 'gift', 'endorsement', 'other')),
  
  -- 互动内容
  content TEXT,
  metadata JSONB,
  
  -- 价值评估
  value_score DECIMAL(5,2) DEFAULT 0,  -- 本次互动价值 (0-10)
  spirit_coin_reward DECIMAL(10,2) DEFAULT 0,
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- 索引
  INDEX idx_interactions_user (user_id),
  INDEX idx_interactions_type (interaction_type),
  INDEX idx_interactions_created (created_at DESC)
);

-- ============================================
-- 交易记录表
-- ============================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- 交易信息
  amount DECIMAL(20,8) NOT NULL,
  transaction_type VARCHAR(50) NOT NULL
    CHECK (transaction_type IN ('earn', 'spend', 'transfer', 'reward', 'penalty', 'system')),
  
  -- 交易原因
  reason VARCHAR(255),
  reference_id UUID,  -- 关联的互动 ID 或其他
  metadata JSONB,
  
  -- 余额快照
  from_balance_before DECIMAL(20,8),
  from_balance_after DECIMAL(20,8),
  to_balance_before DECIMAL(20,8),
  to_balance_after DECIMAL(20,8),
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- 索引
  INDEX idx_transactions_from (from_user_id),
  INDEX idx_transactions_to (to_user_id),
  INDEX idx_transactions_type (transaction_type),
  INDEX idx_transactions_created (created_at DESC)
);

-- ============================================
-- 评分记录表 (审计日志)
-- ============================================
CREATE TABLE score_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- 评分类型
  score_type VARCHAR(20) NOT NULL
    CHECK (score_type IN ('morality', 'cultivation', 'social')),
  
  -- 评分变化
  old_score DECIMAL(5,2),
  new_score DECIMAL(5,2),
  delta DECIMAL(5,2),
  
  -- 变化原因
  reason VARCHAR(255),
  reference_id UUID,
  metadata JSONB,
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- 索引
  INDEX idx_score_records_user (user_id),
  INDEX idx_score_records_type (score_type),
  INDEX idx_score_records_created (created_at DESC)
);

-- ============================================
-- 资源登记表 (未来扩展)
-- ============================================
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- 资源类型
  resource_type VARCHAR(50) NOT NULL
    CHECK (resource_type IN ('property', 'vehicle', 'equipment', 'other')),
  
  -- 资源信息
  name VARCHAR(255) NOT NULL,
  description TEXT,
  metadata JSONB,
  
  -- 价值评估
  estimated_value DECIMAL(20,2),
  
  -- 共享状态
  is_shareable BOOLEAN DEFAULT false,
  share_conditions JSONB,
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- 索引
  INDEX idx_resources_owner (owner_id),
  INDEX idx_resources_type (resource_type)
);
```

---

### 1.2 视图与函数

```sql
-- ============================================
-- 视图：用户综合评分
-- ============================================
CREATE VIEW user_comprehensive_scores AS
SELECT 
  u.id,
  u.username,
  u.spirit_coin_balance,
  u.morality_score,
  u.cultivation_score,
  u.social_score,
  -- 综合评分 (加权平均)
  (u.morality_score * 0.4 + u.cultivation_score * 0.3 + u.social_score * 0.3) AS comprehensive_score,
  -- 关系数量统计
  COUNT(DISTINCT CASE WHEN r.user_id = u.id THEN r.target_user_id END) AS following_count,
  COUNT(DISTINCT CASE WHEN r.target_user_id = u.id THEN r.user_id END) AS follower_count
FROM users u
LEFT JOIN relationships r ON u.id = r.user_id OR u.id = r.target_user_id
GROUP BY u.id, u.username, u.spirit_coin_balance, u.morality_score, u.cultivation_score, u.social_score;

-- ============================================
-- 函数：更新关系强度
-- ============================================
CREATE OR REPLACE FUNCTION update_relationship_strength(
  p_user_id UUID,
  p_target_user_id UUID
) RETURNS VOID AS $$
DECLARE
  v_interaction_count INTEGER;
  v_trust_score DECIMAL(5,2);
  v_cooperation_score DECIMAL(5,2);
  v_new_strength DECIMAL(5,2);
BEGIN
  -- 获取互动统计
  SELECT 
    COUNT(*)::INTEGER,
    AVG(value_score),
    AVG(CASE WHEN interaction_type = 'collaboration' THEN value_score END)
  INTO v_interaction_count, v_trust_score, v_cooperation_score
  FROM interactions
  WHERE user_id = p_user_id AND target_user_id = p_target_user_id;
  
  -- 计算关系强度
  v_new_strength := (
    LEAST(v_interaction_count, 100) * 0.3 +  -- 互动频率 (最多 100 次)
    COALESCE(v_trust_score, 0) * 10 * 0.4 +   -- 信任度 (0-10 转 0-100)
    COALESCE(v_cooperation_score, 0) * 10 * 0.3 -- 合作度
  );
  
  -- 更新关系表
  UPDATE relationships
  SET 
    relationship_strength = LEAST(v_new_strength, 100),
    interaction_count = v_interaction_count,
    trust_score = COALESCE(v_trust_score, 0),
    cooperation_score = COALESCE(v_cooperation_score, 0),
    updated_at = NOW()
  WHERE user_id = p_user_id AND target_user_id = p_target_user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 函数：自动升级关系类型
-- ============================================
CREATE OR REPLACE FUNCTION auto_upgrade_relationship_type()
RETURNS TRIGGER AS $$
BEGIN
  -- 根据关系强度自动升级
  IF NEW.relationship_strength >= 80 THEN
    NEW.relationship_type := 'ally';
  ELSIF NEW.relationship_strength >= 60 THEN
    NEW.relationship_type := 'confidant';
  ELSIF NEW.relationship_strength >= 40 THEN
    NEW.relationship_type := 'friend';
  ELSIF NEW.relationship_strength >= 20 THEN
    NEW.relationship_type := 'acquaintance';
  ELSE
    NEW.relationship_type := 'stranger';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
CREATE TRIGGER trg_auto_upgrade_relationship
BEFORE UPDATE ON relationships
FOR EACH ROW
EXECUTE FUNCTION auto_upgrade_relationship_type();
```

---

## 二、API 接口设计

### 2.1 REST API

```yaml
openapi: 3.0.3
info:
  title: 灵境 APP API
  version: 0.1.0
  description: 灵境 (Spirit Realm) APP - 精神货币与关系自组织系统

servers:
  - url: https://api.lingjing.app
    description: 生产环境
  - url: https://api-dev.lingjing.app
    description: 开发环境

paths:
  /auth/register:
    post:
      summary: 用户注册
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                username:
                  type: string
                  minLength: 3
                  maxLength: 50
                email:
                  type: string
                  format: email
                password:
                  type: string
                  minLength: 8
      responses:
        '201':
          description: 注册成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'

  /auth/login:
    post:
      summary: 用户登录
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                username:
                  type: string
                password:
                  type: string
      responses:
        '200':
          description: 登录成功
          headers:
            Authorization:
              schema:
                type: string
              description: Bearer Token

  /users/me:
    get:
      summary: 获取当前用户信息
      security:
        - bearerAuth: []
      responses:
        '200':
          description: 用户信息
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'

  /users/{userId}/relationships:
    get:
      summary: 获取用户关系列表
      security:
        - bearerAuth: []
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: type
          in: query
          schema:
            type: string
            enum: [following, follower, mutual]
      responses:
        '200':
          description: 关系列表
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Relationship'

  /relationships:
    post:
      summary: 建立关系
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                targetUserId:
                  type: string
                  format: uuid
      responses:
        '201':
          description: 关系建立成功

  /interactions:
    post:
      summary: 记录互动
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/InteractionInput'
      responses:
        '201':
          description: 互动记录成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Interaction'

  /transactions:
    get:
      summary: 获取交易记录
      security:
        - bearerAuth: []
      parameters:
        - name: type
          in: query
          schema:
            type: string
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
      responses:
        '200':
          description: 交易记录列表

  /scores/calculate:
    post:
      summary: 计算评分
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                userId:
                  type: string
                  format: uuid
                scoreType:
                  type: string
                  enum: [morality, cultivation, social]
      responses:
        '200':
          description: 评分结果

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        username:
          type: string
        email:
          type: string
        spiritCoinBalance:
          type: number
        moralityScore:
          type: number
        cultivationScore:
          type: number
        socialScore:
          type: number
        relationshipLevel:
          type: string
        createdAt:
          type: string
          format: date-time

    Relationship:
      type: object
      properties:
        id:
          type: string
          format: uuid
        userId:
          type: string
          format: uuid
        targetUserId:
          type: string
          format: uuid
        relationshipType:
          type: string
        relationshipStrength:
          type: number
        trustScore:
          type: number
        cooperationScore:
          type: number
        interactionCount:
          type: integer

    InteractionInput:
      type: object
      required:
        - targetUserId
        - interactionType
      properties:
        targetUserId:
          type: string
          format: uuid
        interactionType:
          type: string
          enum: [message, help, collaboration, gift, endorsement, other]
        content:
          type: string
        metadata:
          type: object

    Interaction:
      allOf:
        - $ref: '#/components/schemas/InteractionInput'
        - type: object
          properties:
            id:
              type: string
              format: uuid
            valueScore:
              type: number
            spiritCoinReward:
              type: number
            createdAt:
              type: string
              format: date-time
```

---

## 三、项目目录结构

```
lingjing-app/
├── apps/
│   ├── mobile/                 # React Native 移动 APP
│   │   ├── src/
│   │   │   ├── components/     # 通用组件
│   │   │   ├── screens/        # 页面
│   │   │   ├── navigation/     # 导航
│   │   │   ├── store/          # Redux store
│   │   │   ├── services/       # API 服务
│   │   │   └── utils/          # 工具函数
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                    # Next.js Web Dashboard
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── styles/
│       │   └── utils/
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── api/                    # NestJS 后端 API
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── user/
│   │   │   │   ├── spirit-coin/
│   │   │   │   ├── relationship/
│   │   │   │   ├── interaction/
│   │   │   │   ├── transaction/
│   │   │   │   └── score/
│   │   │   ├── common/
│   │   │   ├── config/
│   │   │   └── main.ts
│   │   ├── test/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared/                 # 共享代码
│       ├── types/              # TypeScript 类型定义
│       ├── utils/              # 共享工具函数
│       └── package.json
│
├── docs/                       # 文档
│   ├── api/
│   ├── database/
│   └── design/
│
├── docker/                     # Docker 配置
│   ├── api/
│   │   └── Dockerfile
│   └── db/
│       └── init.sql
│
├── package.json                # Monorepo 根配置
├── pnpm-workspace.yaml         # pnpm workspace
└── README.md
```

---

## 四、开发规范

### 4.1 代码规范

```json
{
  "editorconfig": {
    "root": true,
    "*": {
      "indent_style": "space",
      "indent_size": 2,
      "end_of_line": "lf",
      "charset": "utf-8",
      "trim_trailing_whitespace": true,
      "insert_final_newline": true
    }
  },
  "eslint": {
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier"
    ]
  },
  "prettier": {
    "singleQuote": true,
    "trailingComma": "es5",
    "printWidth": 100
  }
}
```

### 4.2 Git 规范

```bash
# Commit 消息格式
<type>(<scope>): <subject>

# type 类型
feat:     新功能
fix:      Bug 修复
docs:     文档更新
style:    代码格式 (不影响代码运行)
refactor: 重构
test:     测试相关
chore:    构建/工具链相关

# 示例
feat(user): 添加用户注册功能
fix(api): 修复登录接口 token 验证问题
docs: 更新 API 文档
```

---

## 五、第一周开发计划

### Day 1-2: 环境搭建

- [ ] 创建 GitHub 仓库
- [ ] 初始化 pnpm workspace
- [ ] 配置 ESLint + Prettier
- [ ] 创建 NestJS 项目
- [ ] 创建 React Native 项目
- [ ] 创建 Next.js 项目

### Day 3-4: 数据库 + 基础 API

- [ ] Railway PostgreSQL 部署
- [ ] 运行数据库迁移
- [ ] 实现用户认证 API
- [ ] 实现用户 CRUD API
- [ ] API 测试

### Day 5-7: 核心功能

- [ ] 实现关系 API
- [ ] 实现互动 API
- [ ] 实现精神货币 API
- [ ] 实现评分计算 API
- [ ] 集成测试

---

*创建时间：2026-03-06 10:14*  
*创建者：墨衍*  
*版本：v0.1*
