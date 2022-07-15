import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AttendanceHistoryResponse {
    
    @Field()
    attendance_date: string;

    @Field()
    is_present: boolean;
}
