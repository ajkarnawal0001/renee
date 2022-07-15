import { InputType, Field } from '@nestjs/graphql';
import { ProductDetail } from './product_details.dto';

@InputType()
export class CreateOutletSaleInput {
  @Field()
  store: string;

  @Field()
  sold_by: string;
  
  @Field()
  date: string;

  @Field()
  sale_id: string;

  @Field((type) => [ProductDetail])
  product_detail: ProductDetail[];
}
