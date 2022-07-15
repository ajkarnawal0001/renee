import { InputType, Field, ID } from "@nestjs/graphql";
import { IsUUID } from "class-validator";

@InputType()
export class AddOpeningStockInput {
  @Field(type => ID)
  id: string;

  @Field()
  product_id:string;
}