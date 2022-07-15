import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { getRepository, Repository } from 'typeorm';
import { UserEntity } from '../user/entities';

@Injectable()
export class UtilityService {
    constructor(
    @InjectRepository(UserEntity)
    private usersEntity: Repository<UserEntity>,
  ) {}

  
  async generateRandomToken(): Promise<string> {
    try {
      const token = crypto.randomBytes(16).toString('hex');
      return this.isTokenPresentInAnotherUser(token);
    } catch (error) {
      Logger.error(error);
    }
  }

  async isTokenPresentInAnotherUser(token: string): Promise<string> {
    const result = await this.usersEntity.findOne({
      where: {
      reset_password_token: token,
      },
    });

    return result ? this.generateRandomToken() : token;
  }

  async getDateRange(startDate, endDate) {
    const dateQuery =
      '' +
      'SELECT generate_series(\'' +
      startDate.toISOString() +
      '\'::timestamp, \'' +
      endDate.toISOString() +
      '\'::timestamp, INTERVAL \'1 day\') ' +
      'AS attendance_date ' +
      'order by attendance_date';

    return this.usersEntity.query(dateQuery);
  }

  async mergeDateRangeWithAttendance(dateQueryResponse, attendanceQueryResponse) {
      const response = [];
      for (let i = 0; i < dateQueryResponse.length; i++) {
        const date = dateQueryResponse[i];
        const attendance = attendanceQueryResponse.find(
          (attendance) => attendance.attendance_date === date.attendance_date,
        );
        if (attendance) {
          response.push({
            attendance_date: attendance.attendance_date,
            is_present: attendance.is_present,
          });
        } else {
          response.push({
            attendance_date: date.attendance_date,
            is_present: false,
          });
        }
      }
      return response;
    }   
}
