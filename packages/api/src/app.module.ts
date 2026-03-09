import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// 实体
import { User } from './modules/user/user.entity';
import { SpiritTransaction } from './modules/spirit-currency/spirit-transaction.entity';
import { Relationship } from './modules/relationships/relationships.entity';
import { InteractionRecord } from './modules/interaction-record/interaction-record.entity';

// 控制器
import { UserController } from './modules/user/user.controller';
import { SpiritCurrencyController } from './modules/spirit-currency/spirit-currency.controller';
import { RelationshipsController } from './modules/relationships/relationships.controller';
import { InteractionRecordController } from './modules/interaction-record/interaction-record.controller';

// 服务
import { UserService } from './modules/user/user.service';
import { SpiritCurrencyService } from './modules/spirit-currency/spirit-currency.service';
import { RelationshipsService } from './modules/relationships/relationships.service';
import { InteractionRecordService } from './modules/interaction-record/interaction-record.service';
import { AlgorithmService } from './modules/algorithm/algorithm.service';
import { AlgorithmController } from './modules/algorithm/algorithm.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USER', 'lingjing'),
        password: configService.get('DATABASE_PASSWORD', 'lingjing123'),
        database: configService.get('DATABASE_NAME', 'lingjing'),
        entities: [User, SpiritTransaction, Relationship, InteractionRecord],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, SpiritTransaction, Relationship, InteractionRecord]),
  ],
  controllers: [
    UserController, 
    SpiritCurrencyController,
    RelationshipsController,
    InteractionRecordController,
    AlgorithmController
  ],
  providers: [
    UserService,
    SpiritCurrencyService,
    RelationshipsService,
    InteractionRecordService,
    AlgorithmService
  ],
})
export class AppModule {}
