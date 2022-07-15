import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from "@nestjs/common";
import { AttendanceEntity } from './entities';
import { AttendanceService } from './attendance.service';
import { AttendanceResolver } from './attendance.resolver';
import { UtilityService } from '../utility';
import { UserEntity } from '../user/entities';

@Module({
    imports: [
        TypeOrmModule.forFeature([AttendanceEntity]),
        TypeOrmModule.forFeature([UserEntity])
    ],
    providers: [AttendanceService, AttendanceResolver, UtilityService],
    exports: [AttendanceService, ],
})
export class AttendanceModule {}