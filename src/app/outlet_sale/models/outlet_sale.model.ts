import { ObjectType, Int, Field } from '@nestjs/graphql';

@ObjectType()
export class OutletSaleModel {
  @Field()
  store: string;

  @Field()
  sold_by: string;

  @Field()
  date:string

  @Field()
  sale_id:string

  @Field()
  id:string;
}