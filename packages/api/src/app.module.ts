import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // 加载环境变量配置
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // TODO: 添加模块
    // UsersModule,
    // SpiritCurrencyModule,
    // RelationshipModule,
    // InteractionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
