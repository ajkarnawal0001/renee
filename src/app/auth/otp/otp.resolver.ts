import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { GqlThrottlerGuard, Role } from '@utility';
import { AuthResponse } from '../models/auth-response.model';
import { ROLES } from 'src/core/constant';
import { ValidateOtpDto, SendOtpDto } from './dto';
import { UserOtpResponse } from './models';
import { OtpService } from './otp.service';

@Resolver()
export class OtpResolver {
  constructor(private otpService: OtpService) {}

  @Mutation(() => AuthResponse)
  async ba_verify_Otp(
    @Args('input', { type: () => ValidateOtpDto }) validateOtp: ValidateOtpDto,
  ) {
    return this.otpService.verifyOtp(
      validateOtp.phone,
      validateOtp.otp,
    );
  }


  @UseGuards(GqlThrottlerGuard)
  @Mutation(() => UserOtpResponse)
  async ba_login_Otp(@Args('input', { type: () => SendOtpDto }) data: SendOtpDto) {
    return this.otpService.createAndSendOtp(data);
  }
}
