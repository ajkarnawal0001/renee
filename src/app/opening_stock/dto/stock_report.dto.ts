import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class StockReportDto {
  @Field()
  month: string;

  @Field()
  year: string;
}