import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
