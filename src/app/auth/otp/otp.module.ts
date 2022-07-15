import { Module } from '@nestjs/common';
import { OtpResolver } from './otp.resolver';
import { OtpService } from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../user/entities';
import { CountryModule } from '../../country/country.module';
import { OtpEntity } from './entities';
import { SmsModule } from 'src/app/sms/sms.module';
import { JWT_SECRET, JWT_EXPIRES_IN_DAYS } from '@environments';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/app/user/user.module';
import { PasswordModule } from '../password/password.module';

@Module({
  imports: [TypeOrmModule.forFeature([OtpEntity, UserEntity]), CountryModule, SmsModule,
  JwtModule.register({
        secret: JWT_SECRET,
        verifyOptions: {
          algorithms: ['HS256'],
        },
        signOptions: { expiresIn: `${JWT_EXPIRES_IN_DAYS}d` },
      }),
    PasswordModule,
    OtpModule,
    UserModule, ],
  providers: [OtpResolver, OtpService],
  exports: [OtpService],
})
export class OtpModule {}
