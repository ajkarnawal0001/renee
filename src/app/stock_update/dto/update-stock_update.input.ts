import { CreateStockUpdateInput } from './create-stock_update.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateStockUpdateInput extends PartialType(CreateStockUpdateInput) {
  @Field(() => Int)
  id: number;
}
