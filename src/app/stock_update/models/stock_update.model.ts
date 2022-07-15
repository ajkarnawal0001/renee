import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class AddOpeningStockModel {
  @Field()
  is_stock_updated: boolean;
  @Field()
  store_id:string;
  @Field()
  updated_by:string;
}
