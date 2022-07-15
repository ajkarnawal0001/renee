import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class OtpLoginDto {
  @Field()
  phone: string;
}
