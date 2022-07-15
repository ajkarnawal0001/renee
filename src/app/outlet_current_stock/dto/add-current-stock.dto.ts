import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class AddOutletCurrentStockDto {
  @Field()
  id: string
  @Field()
  store_id: string;
  @Field()
  product_id: string;
  @Field()
  quantity: string;
  @Field()
  added_by: string;
}
