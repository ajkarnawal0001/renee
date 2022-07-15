import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ValidateOtpDto {
  @Field()
  phone: string;

  @Field()
  otp: string;
}
