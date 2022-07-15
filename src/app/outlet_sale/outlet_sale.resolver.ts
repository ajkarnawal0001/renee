import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OutletSaleService } from './outlet_sale.service';
import { OutletSale } from './entities/outlet_sale.entity';
import { CreateOutletSaleInput } from './dto/create_outlet_sale.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@utility';
import { SoldProductModel } from './models/product-detail.model';
import { AddoutletReturns } from './models/outlet_return.model';
import { CreateOutletreturnsInput } from './dto';

@Resolver(() => OutletSale)
export class OutletSaleResolver {
  constructor(private readonly outletSaleService: OutletSaleService) {}

  @Mutation(() => [SoldProductModel])
  @UseGuards(JwtAuthGuard)
  async createOutletSale(
    @Args('input') createOutletSaleInput: CreateOutletSaleInput) {
    return  this.outletSaleService.create(createOutletSaleInput);
  }

  @Mutation(() => [AddoutletReturns])
  @UseGuards(JwtAuthGuard)
  async returnOutletStock(
    @Args('input') CreateOutletreturnsInput: CreateOutletreturnsInput){
      return await this.outletSaleService.returnStock(CreateOutletreturnsInput);
    }

}
