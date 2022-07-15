import { Module, forwardRef } from '@nestjs/common';
import { StockUpdateService } from './stock_update.service';
import { StockUpdateResolver } from './stock_update.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockUpdateEntity } from './entities';
import { OpeningStockModule } from '../opening_stock/opening_stock.module';

@Module({
  imports:[TypeOrmModule.forFeature([StockUpdateEntity]),forwardRef(()=>OpeningStockModule)],
  providers: [StockUpdateResolver, StockUpdateService],
  exports:[StockUpdateService],
})
export class StockUpdateModule {}
