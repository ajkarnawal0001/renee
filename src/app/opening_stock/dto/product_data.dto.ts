import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class ProductData {
  @Field()
  product_id: string;

  @Field()
  quantity: string;
}