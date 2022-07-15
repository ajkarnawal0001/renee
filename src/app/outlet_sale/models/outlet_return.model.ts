import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AddoutletReturns {
  @Field()
  id?:string;

  @Field()
  sale_id: string;
  
  @Field()
  product_quantity: string;

  @Field()
  reason?: string;
}
