# 关系图谱模块 (RelationshipGraphModule)

> 开发时间：2026-03-07

## 📋 任务概述

实现用户关系图谱管理系统，支持：
- 关系类型：stranger → acquaintance → friend → confidant → ally
- 关系强度 (0-100)
- 子维度评分：信任度、合作度
- 互动统计

## 📊 数据库设计

### relationships 表

```sql
CREATE TABLE relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- 关系类型
  relationship_type VARCHAR(20) DEFAULT 'stranger',
  
  -- 关系强度 (0-100)
  relationship_strength DECIMAL(5,2) DEFAULT 0,
  
  -- 子维度评分
  trust_score DECIMAL(5,2) DEFAULT 0,
  cooperation_score DECIMAL(5,2) DEFAULT 0,
  
  -- 互动统计
  interaction_count INTEGER DEFAULT 0,
  last_interaction_at TIMESTAMP,
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, target_user_id)
);
```

## 🔧 开发计划

- [ ] 1. 创建 Relationship 实体
- [ ] 2. 创建 RelationshipsService
- [ ] 3. 创建 RelationshipsController
- [ ] 4. 实现 CRUD API
- [ ] 5. 实现关系强度更新逻辑
- [ ] 6. 实现自动升级关系类型
- [ ] 7. 编写单元测试

## 📝 API 设计

### GET /relationships
获取当前用户的关系列表

### POST /relationships
建立新关系

### PATCH /relationships/:id
更新关系（强度、类型等）

### POST /relationships/:id/interaction
记录互动，自动更新关系强度

## 🚧 进度

- [ ] 开发中
