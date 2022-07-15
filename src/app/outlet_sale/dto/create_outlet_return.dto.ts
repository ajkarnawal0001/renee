import { InputType, Field } from '@nestjs/graphql';
import { ReturnProductDetailDto } from './return_product_detail.dto';

@InputType()
export class CreateOutletreturnsInput {
  @Field()
  sale_id: string;

  @Field()
  reason?: string;

  @Field((type)=>[ReturnProductDetailDto])
  product_detail:ReturnProductDetailDto[]
}
