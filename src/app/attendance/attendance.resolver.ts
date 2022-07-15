import { Query, UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { JwtAuthGuard } from "@utility";
import { AttendanceService } from "./attendance.service";
import { AttendanceHistoryDto } from "./dto";
import { AttendanceHistoryResponse } from "./models";

Resolver()
export class AttendanceResolver {
  constructor(
    private readonly attendanceService: AttendanceService,
  ) {}

    @Mutation(() => [AttendanceHistoryResponse])
    @UseGuards(JwtAuthGuard)
    async attendanceHistory(
        @Args('input', { type: () => AttendanceHistoryDto })
        data: AttendanceHistoryDto,
        ) {
        return this.attendanceService.attendanceHistory(data);
    }
}