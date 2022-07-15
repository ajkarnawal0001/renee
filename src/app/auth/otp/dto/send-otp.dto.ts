import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SendOtpDto {
  @Field()
  phone: string;

  @Field()
  country_id: string;
}
