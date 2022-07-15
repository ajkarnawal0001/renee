import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { AddOpeningStockDto } from './add_opening_stock.dto';
import { ProductData } from './product_data.dto';
@InputType()
export class updateOpeningStock extends PartialType(AddOpeningStockDto) {
  @Field((type)=>[ProductData])
  productData:ProductData[]

  @Field()
  type:string;
}
