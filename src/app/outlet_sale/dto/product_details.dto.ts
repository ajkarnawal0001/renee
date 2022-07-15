import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class ProductDetail {
  @Field()
  sold_item: string;

  @Field()
  quantity: number;

  @Field()
  price:number
}