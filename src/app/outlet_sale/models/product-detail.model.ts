import { ObjectType, Int, Field } from '@nestjs/graphql';

@ObjectType()
export class SoldProductModel {
  @Field()
  sale_id:string;

  @Field()
  product_id: string;

  @Field()
  product_quantity: number;

  @Field()
  product_price:number

  @Field()
  total_amount:number

  @Field()
  id:string;
}