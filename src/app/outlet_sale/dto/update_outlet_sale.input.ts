import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddOutletSaleInput {
  @Field()
  sale_id:string;

  @Field()
  store: string;

  @Field()
  sold_by:string;
  
  @Field()
  date:string;
}
