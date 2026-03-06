import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { SpiritCurrencyModule } from './modules/spirit-currency/spirit-currency.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
