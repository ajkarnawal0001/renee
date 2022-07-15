import { Module , forwardRef} from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreResolver } from './store.resolver';
import { StoreEntity } from './entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpeningStockModule } from '../opening_stock/opening_stock.module';
@Module({
  providers: [StoreResolver, StoreService],
  imports:[ TypeOrmModule.forFeature([StoreEntity]),forwardRef(()=>OpeningStockModule)],
  exports:[StoreService]
})
export class StoreModule {}
