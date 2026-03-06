import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpiritCurrencyController } from './spirit-currency.controller';
import { SpiritCurrencyService } from './spirit-currency.service';
import { SpiritTransaction } from './spirit-transaction.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpiritTransaction, User])],
  controllers: [SpiritCurrencyController],
  providers: [SpiritCurrencyService],
  exports: [SpiritCurrencyService],
})
export class SpiritCurrencyModule {}
