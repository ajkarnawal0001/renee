import { InputType, Field } from '@nestjs/graphql';
import { ProductDetail } from './product_details.dto';

@InputType()
export class ReturnOutletSaleInput {
  @Field()
  store: string;

  @Field()
  sale_id: string;

  @Field()
  customer_name: string;

  @Field()
  customer_email_id: string;

  @Field()
  customer_phone_number: string;

  @Field()
  comment?:string;

  @Field((type) => [ProductDetail])
  product_detail: ProductDetail[];
}
