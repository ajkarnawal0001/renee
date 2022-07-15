import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { async } from "rxjs";
import { Repository } from "typeorm";
import { UtilityService } from "../utility";
import { AttendanceHistoryDto } from "./dto";
import { AttendanceEntity } from "./entities";

@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(AttendanceEntity)
        private attendanceEntity: Repository<AttendanceEntity>,
        private readonly utilityService: UtilityService,
    ) {}

    async attendanceHistory(data: AttendanceHistoryDto) {
        let { startDate, endDate, user_id } = data;
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        
        const dateQueryResponse = await this.utilityService.getDateRange(
            startDate,
            endDate,        
        );

        const attendanceQueryResponse = await this.attendanceEntity
        .createQueryBuilder('a')
        .select('a.attendance_date', 'attendance_date')
        .addSelect('a.is_present', 'is_present')
        .where('a.user_id = :user_id', { user_id }).
        andWhere('a.attendance_date BETWEEN :startDate AND :endDate', { startDate, endDate })
        .orderBy('a.attendance_date', 'ASC')
        .getRawMany();

        return await this.utilityService.mergeDateRangeWithAttendance(
            dateQueryResponse,
            attendanceQueryResponse,
        );
    }
}