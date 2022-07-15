import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserOtpResponse {
  @Field()
  id?: string;

  @Field({ nullable: true })
  otp_secret?: string;

  @Field()
  phone: string;

  @Field()
  created_at?: Date;

  @Field()
  updated_at?: Date;
}
