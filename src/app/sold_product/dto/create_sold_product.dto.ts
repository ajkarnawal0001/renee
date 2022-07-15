import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateSoldProductInput {
  @Field()
  sale_id: string;

  @Field()
  product_id: string;
  
  @Field()
  product_price: number;

  @Field()
  product_quantity: number;

  @Field()
  total_amount: number;

}
