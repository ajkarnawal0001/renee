import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UploadProductDto {
  @Field()
  csv_file_url: string;

  @Field()
  role: string;
}
