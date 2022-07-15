import { Module } from '@nestjs/common';
import { OutletSaleService } from './outlet_sale.service';
import { OutletSaleResolver } from './outlet_sale.resolver';
import { OpeningStockModule } from '../opening_stock/opening_stock.module';
import { StoreModule } from '../store/store.module';
import { OutletReturnEntity, OutletSale } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoldProductModule } from '../sold_product/sold_product.module';
import { OutletCurrentStockModule } from '../outlet_current_stock/outlet_current_stock.module';
@Module({
  providers: [OutletSaleResolver, OutletSaleService],
  imports: [
    TypeOrmModule.forFeature([OutletSale,OutletReturnEntity]),
    OpeningStockModule,
    StoreModule,
    SoldProductModule,
    OutletCurrentStockModule,
  ],
  exports:[OutletSaleService]
})
export class OutletSaleModule {}
