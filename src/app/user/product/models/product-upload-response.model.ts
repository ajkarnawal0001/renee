import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UploadProductResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
