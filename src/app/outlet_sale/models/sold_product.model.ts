import { Field, ObjectType } from '@nestjs/graphql';
import { OutletSaleModel } from './outlet_sale.model';
import { SoldProductModel } from './product-detail.model';

@ObjectType()
export class AddoutletSale {
 
  @Field((type)=>OutletSaleModel)
  outletSale:OutletSaleModel

  @Field((type)=> [SoldProductModel])
  soldProduct:SoldProductModel[]
}
