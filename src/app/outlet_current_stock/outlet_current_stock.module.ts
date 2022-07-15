import { Module } from '@nestjs/common';
import { OutletCurrentStockService } from './outlet_current_stock.service';
import { OutletCurrentStockResolver } from './outlet_current_stock.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutletCurrentStock } from './entity';

@Module({
  providers: [OutletCurrentStockResolver, OutletCurrentStockService],
  imports:[TypeOrmModule.forFeature([OutletCurrentStock])],
  exports:[OutletCurrentStockService]
})
export class OutletCurrentStockModule {}
