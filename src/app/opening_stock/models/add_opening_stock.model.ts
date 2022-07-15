import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class AddStockModel {
  @Field()
  id:string;
  @Field()
  store_id: string;
  @Field({nullable:true})
  product_id?:string;
  @Field({nullable:true})
  quantity?:number;
}
