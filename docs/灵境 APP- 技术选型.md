# 灵境 APP 技术选型 v0.1

> 灵境 (Spirit Realm) APP - 技术架构与选型决策
> 
> 创建时间：2026-03-06 09:51  
> 版本：v0.1

---

## 系统架构概览

```
┌─────────────────────────────────────────────────────────┐
│                    灵境 APP                              │
├─────────────────────────────────────────────────────────┤
│  前端层 (Frontend)                                       │
│  - 移动 APP (iOS/Android)                                │
│  - Web Dashboard                                         │
├─────────────────────────────────────────────────────────┤
│  后端层 (Backend)                                        │
│  - API Gateway                                           │
│  - 用户服务                                              │
│  - 精神货币服务                                          │
│  - 关系图谱服务                                          │
│  - 资源分配服务                                          │
├─────────────────────────────────────────────────────────┤
│  区块链层 (Blockchain)                                   │
│  - 精神货币合约                                          │
│  - 关系 NFT                                              │
│  - 治理 DAO                                              │
├─────────────────────────────────────────────────────────┤
│  AI 服务层 (AI Services)                                 │
│  - 智能体对话                                            │
│  - 价值评估模型                                          │
│  - 关系推荐引擎                                          │
├─────────────────────────────────────────────────────────┤
│  数据层 (Data)                                           │
│  - PostgreSQL (关系数据)                                 │
│  - Redis (缓存)                                          │
│  - IPFS (去中心化存储)                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 技术选型决策

### 一、前端技术

#### 移动 APP

| 选项 | 优势 | 劣势 | 评分 |
|------|------|------|------|
| **React Native** | 跨平台、生态成熟、团队熟悉 | 性能略低于原生 | 85 |
| **Flutter** | 高性能、UI 一致性好 | 生态较新、Dart 学习成本 | 80 |
| **原生 (Swift/Kotlin)** | 最佳性能、完整 API 访问 | 开发成本高、维护成本双份 | 70 |
| **PWA** | 开发成本低、无需应用商店 | 功能受限、用户体验一般 | 60 |

**决策：React Native**

**理由：**
- 团队已有 JavaScript/TypeScript 经验
- 生态成熟，第三方库丰富
- 可复用 Web 端代码
- 性能满足 MVP 需求

**依赖库：**
```json
{
  "react-native": "^0.73.0",
  "react-navigation": "^6.0.0",
  "redux": "^5.0.0",
  "axios": "^1.6.0",
  "react-native-crypto": "^2.0.0"
}
```

---

#### Web Dashboard

| 选项 | 优势 | 劣势 | 评分 |
|------|------|------|------|
| **React + Next.js** | SSR、SEO 友好、生态成熟 | 学习曲线 | 90 |
| **Vue + Nuxt** | 易上手、文档好 | 生态略小于 React | 85 |
| **Svelte + SvelteKit** | 轻量、性能好 | 生态新、社区小 | 75 |

**决策：React + Next.js**

**理由：**
- 与 React Native 技术栈统一
- SSR 支持，SEO 友好
- Vercel 部署简单

---

### 二、后端技术

#### 主框架

| 选项 | 优势 | 劣势 | 评分 |
|------|------|------|------|
| **Node.js + Express/NestJS** | 团队熟悉、生态成熟、异步 IO | CPU 密集型任务弱 | 90 |
| **Python + FastAPI** | AI 生态好、开发快 | 性能一般 | 85 |
| **Go + Gin** | 高性能、并发好 | 生态较新、学习成本 | 80 |
| **Rust + Actix** | 最佳性能、内存安全 | 学习曲线陡峭 | 70 |

**决策：Node.js + NestJS**

**理由：**
- 团队已有 JavaScript/TypeScript 经验
- NestJS 提供企业级架构 (依赖注入、模块化)
- 与前端技术栈统一
- 丰富的 npm 生态

**架构模式：**
```
src/
├── modules/
│   ├── user/
│   ├── spirit-coin/
│   ├── relationship/
│   ├── resource-allocation/
│   └── ai-agent/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   └── interceptors/
├── config/
└── main.ts
```

---

#### API 规范

**决策：REST + GraphQL 混合**

- **REST:** 简单 CRUD 操作
- **GraphQL:** 复杂查询 (关系图谱、资源分配)

**理由：**
- REST 简单直接，适合大部分场景
- GraphQL 灵活查询，避免过度/不足获取

---

### 三、数据库

#### 关系型数据库

| 选项 | 优势 | 劣势 | 评分 |
|------|------|------|------|
| **PostgreSQL** | 功能强大、JSON 支持、扩展性好 | 配置略复杂 | 95 |
| **MySQL** | 简单、普及度高 | 高级功能少 | 80 |
| **SQLite** | 零配置、嵌入式 | 不适合高并发 | 60 |

**决策：PostgreSQL**

**理由：**
- JSONB 支持，适合存储动态属性
- 全文搜索功能
- 扩展性 (TimescaleDB for 时间序列数据)
- Railway 免费层 5GB

**核心表设计：**
```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  morality_score DECIMAL(5,2) DEFAULT 0,
  cultivation_score DECIMAL(5,2) DEFAULT 0,
  social_score DECIMAL(5,2) DEFAULT 0,
  spirit_coin_balance DECIMAL(20,8) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 关系表
CREATE TABLE relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  target_user_id UUID REFERENCES users(id),
  relationship_type VARCHAR(20) CHECK (relationship_type IN ('stranger', 'acquaintance', 'friend', 'confidant', 'ally')),
  trust_score DECIMAL(5,2) DEFAULT 0,
  interaction_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, target_user_id)
);

-- 交易记录表
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES users(id),
  to_user_id UUID REFERENCES users(id),
  amount DECIMAL(20,8) NOT NULL,
  transaction_type VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

#### 缓存层

| 选项 | 优势 | 劣势 | 评分 |
|------|------|------|------|
| **Redis** | 高性能、数据结构丰富、持久化 | 内存成本高 | 95 |
| **Memcached** | 简单、内存效率高 | 功能单一 | 75 |

**决策：Redis** (Railway 免费层)

**使用场景：**
- 用户会话
- 精神货币余额缓存
- 关系图谱缓存
- 排行榜

---

### 四、区块链 🚫 暂缓

**决策：MVP 阶段不上链，用中心化数据库代替**

**原因：**
- Polygon 主网部署 + Gas 费用高 (约¥3500-7000)
- 预算有限 (¥1000)
- MVP 阶段验证核心价值更重要

**替代方案：**
- 精神货币：PostgreSQL 数据库记录
- 交易：数据库事务 + 审计日志
- 关系图谱：PostgreSQL + Redis

**未来上链路径：**
```
MVP 验证 (3 个月) → 有收入 → Polygon 主网上线 → 自研链 (可选)
```

**测试网选项 (可选)：**
- Polygon Mumbai 测试网 (免费)
- 用于技术验证，但不承诺真实价值

---

### 五、AI 服务

#### 智能体对话

| 选项 | 优势 | 劣势 | 评分 |
|------|------|------|------|
| **OpenClaw (自研)** | 可控、可定制、数据私有 | 开发成本 | 90 |
| **OpenAI API** | 质量高、开发快 | 成本高、数据出境 | 75 |
| **本地 LLM (Llama)** | 数据私有、一次性成本 | 硬件成本、质量略低 | 80 |

**决策：OpenClaw + 本地 LLM 混合**

**架构：**
```
用户请求 → 路由层 → 
  ├─ 简单对话 → 本地 LLM (Llama 3 8B)
  └─ 复杂任务 → OpenClaw (Qwen3.5-Plus)
```

---

#### 价值评估模型

**决策：自研评分算法 + 机器学习优化**

**初期：** 规则-based 评分 (HEARTBEAT.md 中的公式)  
**后期：** 收集数据后训练专用模型

---

### 六、部署与运维

#### 云服务 (免费优先)

| 组件 | 选型 | 费用 |
|------|------|------|
| 前端托管 | Vercel | ¥0 (免费层) |
| 后端托管 | Railway | ¥0 (免费层 $5 额度) |
| 数据库 | Railway PostgreSQL | ¥0 (免费 5GB) |
| Redis | Railway Redis | ¥0 (免费层) |
| 域名 | Namesilo/阿里云 | ¥50-100/年 |
| CDN | Cloudflare | ¥0 |
| **总计** | | **¥100/年** |

---

#### 监控与日志

| 组件 | 选型 | 费用 |
|------|------|------|
| 日志 | Winston + Loki | ¥0 |
| 监控 | Prometheus + Grafana Cloud | ¥0 (免费层) |
| 告警 | 钉钉 webhook | ¥0 |
| APM | Sentry | ¥0 (免费 50k events/月) |

---

## 技术栈总结 (预算优化版)

| 层级 | 技术 | 费用 |
|------|------|------|
| **移动前端** | React Native + TypeScript | ¥0 |
| **Web 前端** | Next.js 14 + TailwindCSS | ¥0 |
| **后端框架** | NestJS + TypeScript | ¥0 |
| **数据库** | PostgreSQL + Redis (Railway) | ¥0 |
| **区块链** | 🚫 暂缓 (中心化代替) | ¥0 |
| **AI 服务** | OpenClaw + Llama 3 | ¥0 |
| **部署** | Vercel + Railway | ¥0 |
| **域名** | 自定义域名 | ¥50-100/年 |
| **监控** | Grafana + Sentry | ¥0 |
| **总计** | | **¥100/年** |

**剩余预算：¥900 (备用/应急)**

---

## 开发环境配置

### 最低配置

```yaml
开发机器:
  CPU: 8 核
  内存：16GB
  存储：512GB SSD

服务器 (MVP):
  CPU: 4 核
  内存：8GB
  存储：100GB SSD
  数据库：独立实例 4 核 8GB

区块链:
  测试网：Polygon Mumbai
  主网：Polygon PoS
```

---

## 下一步行动

### 第一周 (2026-03-06 ~ 2026-03-13)

- [ ] 搭建开发环境
- [ ] 创建 GitHub 仓库
- [ ] 初始化 NestJS 后端项目
- [ ] 初始化 React Native 项目
- [ ] 设计数据库 Schema
- [ ] 部署测试环境

### 第二周 (2026-03-13 ~ 2026-03-20)

- [ ] 实现用户认证 (Google OAuth)
- [ ] 实现精神货币基础功能
- [ ] 实现关系图谱基础功能
- [ ] 集成 OpenClaw 对话
- [ ] 开发 MVP 界面

### 第三周 (2026-03-20 ~ 2026-03-27)

- [ ] 内部测试
- [ ] 修复 Bug
- [ ] 准备公开发布

---

*创建时间：2026-03-06 09:51*  
*创建者：墨衍*  
*版本：v0.1*
