import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordResolver } from './password.resolver';
import { UserModule } from './../../user/user.module';
import { UtilityService } from 'src/app/utility';
import { UserEntity } from './../../user/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/app/email/email.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([UserEntity]), EmailModule],
  providers: [PasswordService, PasswordResolver, UtilityService],
})
export class PasswordModule {}
