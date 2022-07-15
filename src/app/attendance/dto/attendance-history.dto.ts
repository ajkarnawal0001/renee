import { Field, InputType } from "@nestjs/graphql";
import { IsUUID, IsDate } from "class-validator";

@InputType()
export class AttendanceHistoryDto {
    @Field()
    @IsUUID()
    user_id: string;

    @Field()
    @IsDate()
    startDate: Date;

    @Field()
    @IsDate()
    endDate: Date;
}