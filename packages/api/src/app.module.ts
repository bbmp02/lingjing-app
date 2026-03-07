import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { SpiritCurrencyModule } from './modules/spirit-currency/spirit-currency.module';
import { RelationshipsModule } from './modules/relationships/relationships.module';
import { InteractionRecordModule } from './modules/interaction-record/interaction-record.module';

@Module({
  imports: [
    // 加载环境变量配置
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // 数据库配置
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USER', 'lingjing'),
        password: configService.get('DATABASE_PASSWORD', 'lingjing123'),
        database: configService.get('DATABASE_NAME', 'lingjing'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    // 用户模块
    UserModule,
    // 精神货币模块
    SpiritCurrencyModule,
    // 关系图谱模块
    RelationshipsModule,
    // 互动记录模块
    InteractionRecordModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
