import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { totp } from 'otplib';
import { Repository } from 'typeorm';
import * as randomString from 'randomstring';
import { OtpEntity } from './entities';
import { SendOtpDto } from './dto';
import { ERROR_CODES } from '@errors';
import { UserEntity } from '../../user/entities';
import { SmsService } from 'src/app/sms/sms.service';
import { IAuthResponse, IPayload } from '../interface';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/app/user/user.service';
totp.options = { digits: 6, window: 1, step: 60 };

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private smsService: SmsService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async sendOtpSMS(contactNumber: any, otp: string) {
    const message = `Your Login code for Renee is: ${otp}. Enter the code in app to login.`;
    await this.smsService.sendSms(contactNumber, message);
  }

  async sendOtpEmail(otpEmails: string[], otp: string) {
    // send email logic here
    // await this.emailService.sendOtpEmail({
    //   productName: PRODUCT_NAME,
    //   receiverEmail: otpEmails,
    //   otp: otp,
    // });
  }

  async createAndSendOtp(data: SendOtpDto) {
    const { phone, country_id } = data;

    const ispresent = await this.usersRepository.findOne({
      where: { phone: phone },
    });

    if (ispresent) {
      const otpSecret = await randomString.generate(32);

      const item = {
        otp_secret: otpSecret,
        phone: '+' + country_id + phone,
      };

      const otpCode = await this.generate(otpSecret);

      await this.sendOtpSMS(item.phone, otpCode);

      return this.otpRepository.save(item);
    }

    throw new BadRequestException(
      'User does not exists with this mobile number',
      ERROR_CODES.USER_ALREADY_EXISTS_WITH_THIS_MOBILE_NUMBER,
    );
  }

  async generate(secret: string) {
    return totp.generate(secret);
  }

  async validate(token: string, secret: string) {
    return totp.check(token, secret);
  }

  async verifyOtp(phone: string, otp: string):  Promise<IAuthResponse> {
    const dbUser: any = await this.otpRepository.findOne({
      where: { phone : phone},
      order: { created_at: 'DESC'}
    });

    if (dbUser) {
      const isValidOtp = await this.validate(otp, dbUser.otp_secret);
      if (isValidOtp) {
        const verified_at = new Date().toISOString();
        await this.otpRepository.update(
          { id: dbUser.id },
          { otp_verified_at: verified_at },
        );

      const user: UserEntity = await this.usersRepository.findOne({
        where: { phone: phone.substring(3) },
      });
        

      const payload = this.generatePayload(user.id, user.role);

      return {
        accessToken: this.jwtService.sign(payload),
        data: {
          user_id: user.id,
          role: user.role,
        },
      };
  }
    throw new BadRequestException('Invalid otp', ERROR_CODES.INVALID_OTP);
    }
    throw new NotFoundException(
      'User with given contact number doesn\'t exist',
      ERROR_CODES.USER_NOT_FOUND_WITH_THIS_MOBILE_NUMBER,
    );
  }

  generatePayload(userId: string, role: string): IPayload {
    return {
      'https://hasura.io/jwt/claims': {
        'x-hasura-role': role,
        'x-hasura-user-id': userId,
        'x-hasura-allowed-roles': [role],
        'x-hasura-default-role': role,
      },
    };
  }

  async checkForMobileNumberVerification(mobileNumber: any) {
    // const isPresent = await this.otpRepository.findOne({
    //   mobile_number: mobileNumber,
    // });
    // if (isPresent) {
    //   return true;
    // }
    // return false;
  }
}
