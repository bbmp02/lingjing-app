# 数据库 Schema - 灵境APP

## 表结构

### users (用户表)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(100),
  relationship_level VARCHAR(20) DEFAULT 'stranger',
  moral_score DECIMAL(5,2) DEFAULT 0,
  cultivation_score DECIMAL(5,2) DEFAULT 0,
  social_score DECIMAL(5,2) DEFAULT 0,
  spirit_currency DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### relationships (关系图谱)
```sql
CREATE TABLE relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  relationship_type VARCHAR(20) DEFAULT 'stranger',
  relationship_strength DECIMAL(5,2) DEFAULT 0,
  trust_score DECIMAL(5,2) DEFAULT 0,
  cooperation_score DECIMAL(5,2) DEFAULT 0,
  interaction_count INT DEFAULT 0,
  last_interaction_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, target_user_id)
);
```

### interaction_records (互动记录)
```sql
CREATE TABLE interaction_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  interaction_type VARCHAR(20) NOT NULL,
  content TEXT,
  emotion VARCHAR(20),
  quantity INT DEFAULT 1,
  spirit_value DECIMAL(10,2) DEFAULT 0,
  direction VARCHAR(10) NOT NULL, -- 'send' or 'receive'
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### spirit_transactions (精神货币交易)
```sql
CREATE TABLE spirit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  type VARCHAR(20) NOT NULL, -- reward/gift/trade/investment/punishment
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 索引
```sql
-- 用户索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- 关系索引
CREATE INDEX idx_relationships_user ON relationships(user_id);
CREATE INDEX idx_relationships_target ON relationships(target_user_id);

-- 互动记录索引
CREATE INDEX idx_interactions_user ON interaction_records(user_id);
CREATE INDEX idx_interactions_target ON interaction_records(target_user_id);
CREATE INDEX idx_interactions_type ON interaction_records(interaction_type);
CREATE INDEX idx_interactions_created ON interaction_records(created_at);

-- 交易索引
CREATE INDEX idx_transactions_from ON spirit_transactions(from_user_id);
CREATE INDEX idx_transactions_to ON spirit_transactions(to_user_id);
CREATE INDEX idx_transactions_type ON spirit_transactions(type);
```

---

## 关系图
```
users (1) ←→ (N) relationships
users (1) ←→ (N) interaction_records
users (1) ←→ (N) spirit_transactions (as from)
users (1) ←→ (N) spirit_transactions (as to)
```
