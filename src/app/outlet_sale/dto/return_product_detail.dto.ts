import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ReturnProductDetailDto {
  @Field()
  quantity: number;
  @Field()
  product_id: string;
}
