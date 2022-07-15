import { Module } from '@nestjs/common';
import { SoldProductService } from './sold_product.service';
import { SoldProductResolver } from './sold_product.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoldProduct } from './entity';

@Module({
  providers: [SoldProductResolver, SoldProductService],
  imports:[TypeOrmModule.forFeature([SoldProduct])],
  exports:[SoldProductService]
})
export class SoldProductModule {}
