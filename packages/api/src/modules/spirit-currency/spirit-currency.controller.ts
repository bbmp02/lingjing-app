import { Controller, Get, Post, Body, Param, Query, Headers } from '@nestjs/common';
import { SpiritCurrencyService } from './spirit-currency.service';
import { CreateTransactionDto, QueryTransactionDto } from './dto/spirit-currency.dto';

@Controller('spirit-currency')
export class SpiritCurrencyController {
  constructor(private readonly spiritCurrencyService: SpiritCurrencyService) {}

  @Post('transfer')
  transfer(
    @Body() createTransactionDto: CreateTransactionDto,
    @Headers('x-user-id') userId: string,
  ) {
    return this.spiritCurrencyService.createTransaction(userId, createTransactionDto);
  }

  @Get('transactions')
  getTransactions(@Query() query: QueryTransactionDto) {
    return this.spiritCurrencyService.getTransactions(query);
  }

  @Get('balance/:userId')
  getBalance(@Param('userId') userId: string) {
    return this.spiritCurrencyService.getUserBalance(userId);
  }

  @Get('transactions/:id')
  getTransaction(@Param('id') id: string) {
    return this.spiritCurrencyService.getTransactionById(id);
  }
}
