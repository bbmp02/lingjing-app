import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// 实体导入
import { User } from './user/user.entity';
import { SpiritCurrency } from './spirit-currency/spirit-currency.entity';
import { Relationship } from './relationships/relationship.entity';
import { InteractionRecord } from './interaction-record/interaction-record.entity';

@Module({
  imports: [
    // 数据库配置
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // 优先使用 Railway 提供的 DATABASE_URL
        const databaseUrl = configService.get('DATABASE_URL');
        
        if (databaseUrl) {
          // Railway PostgreSQL
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [User, SpiritCurrency, Relationship, InteractionRecord],
            synchronize: true, // 开发环境自动同步表结构
            logging: configService.get('NODE_ENV') === 'development',
          };
        }

        // 备用：使用独立配置
        const host = configService.get('DATABASE_HOST');
        if (!host) {
          console.log('⚠️ 未配置数据库，以演示模式运行');
          return null;
        }

        return {
          type: 'postgres',
          host,
          port: configService.get('DATABASE_PORT', 5432),
          username: configService.get('DATABASE_USER', 'postgres'),
          password: configService.get('DATABASE_PASSWORD', ''),
          database: configService.get('DATABASE_NAME', 'lingjing'),
          entities: [User, SpiritCurrency, Relationship, InteractionRecord],
          synchronize: true,
          logging: configService.get('NODE_ENV') === 'development',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
