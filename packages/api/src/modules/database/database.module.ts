import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// 实体导入
import { User } from '../user/user.entity';
import { SpiritTransaction } from '../spirit-currency/spirit-transaction.entity';
import { Relationship } from '../relationships/relationships.entity';
import { InteractionRecord } from '../interaction-record/interaction-record.entity';

@Module({
  imports: [
    // 数据库配置
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // 优先使用 Railway 提供的 DATABASE_URL
        const databaseUrl = configService.get('DATABASE_URL');
        
        // 本地开发配置
        const host = configService.get('DATABASE_HOST', 'localhost');
        const port = configService.get('DATABASE_PORT', 5432);
        const username = configService.get('DATABASE_USER', 'lingjing');
        const password = configService.get('DATABASE_PASSWORD', 'lingjing123');
        const database = configService.get('DATABASE_NAME', 'lingjing');
        
        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: [User, SpiritTransaction, Relationship, InteractionRecord],
          synchronize: true, // 开发环境自动同步表结构
          logging: configService.get('NODE_ENV') === 'development',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
