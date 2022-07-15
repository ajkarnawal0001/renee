import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateStockUpdateInput {
  @Field()
  is_stock_updated: boolean;
  @Field()
  store_id:string;
  @Field()
  updated_by:string;
}
