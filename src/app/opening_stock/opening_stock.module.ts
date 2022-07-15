import { Module, forwardRef } from '@nestjs/common';
import { OpeningStockService } from './opening_stock.service';
import { OpeningStockResolver } from './opening_stock.resolver';
import { OpeningStockEntity, StockInwardEntity } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockUpdateModule } from '../stock_update/stock_update.module';
import { StoreModule } from '../store/store.module';
import { OutletCurrentStockModule } from '../outlet_current_stock/outlet_current_stock.module';
import { UtilityService } from '../utility';
import { UserEntity } from '../user/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([OpeningStockEntity,StockInwardEntity]),
    forwardRef(() => StockUpdateModule),
    forwardRef(() => StoreModule),
    OutletCurrentStockModule,
    TypeOrmModule.forFeature([UserEntity])
  ],
  providers: [OpeningStockResolver, OpeningStockService,UtilityService],
  exports: [OpeningStockService],
})
export class OpeningStockModule {}
