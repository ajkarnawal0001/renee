import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { ChangePasswordDto, ForgetPasswordDto, ResetPasswordDto } from './dto';
import { UserEntity } from './../../user/entities';
import { Repository } from 'typeorm';
import {
  IChangePasswordResponse,
  IForgetPasswordResponse,
  IResetPasswordResponse,
} from './interface';
import { UserService } from './../../user/user.service';
import { compareHash, generateHash } from '@utility';
import { UtilityService } from 'src/app/utility';
import { ERROR_CODES } from '@errors';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from '../../email/email.service';
import { ADMIN_APP_URL, RESET_PASSWORD_SLUG } from '@environments';

@Injectable()
export class PasswordService {
  constructor(
    private readonly userService: UserService,
    private readonly utilityService: UtilityService,
    @InjectRepository(UserEntity)
    private usersEntity: Repository<UserEntity>,
    private emailService: EmailService
  ) {}

  /**
   * @author sambhav
   * @param {object} data - ChangePasswordDto
   * @param {object} user - UserEntity
   * @returns {object} IChangePasswordResponse
   * @description change password
   */
  async changePassword(
    data: ChangePasswordDto,
    user: UserEntity,
  ): Promise<IChangePasswordResponse | undefined> {
    const isOldPasswordCorrect = await compareHash(
      data.oldPassword,
      user.password,
    );

    if (!isOldPasswordCorrect) {
      throw new BadRequestException(
        'Incorrect password',
        ERROR_CODES.INCORRECT_PASSWORD,
      );
    }

    await this.setNewPassword(user.id, data.newPassword);

    return {
      success: true,
    } as IChangePasswordResponse;
  }

  /**
   * @author sambhav
   * @param {string} userId
   * @param {string} password
   * @description updates user password
   */
  async setNewPassword(userId: string, password: string): Promise<void> {
    const newHashedPassword = await generateHash(password);

    await this.usersEntity.save({
      id: userId,
      password: newHashedPassword,
    });    
  }

  /**
   * @author sambhav
   * @param {object} data ForgetPasswordDto
   * @returns {object} IForgetPasswordResponse
   * @description sends mail to reset password
   */
  async forgetPassword(
    data: ForgetPasswordDto,
  ): Promise<IForgetPasswordResponse | undefined> {
    const user = await this.userService.findByEmail(data.email);

    if (!user) {
      throw new NotFoundException('User not found', ERROR_CODES.USER_NOT_FOUND);
    }

    const new_reset_password_token = await this.utilityService.generateRandomToken();
    await this.usersEntity.save({
      reset_password_token: new_reset_password_token,
      id: user.id,
    });

    const reset_password_url = `${ADMIN_APP_URL}/${RESET_PASSWORD_SLUG}/${new_reset_password_token}`;

    //  add logic to send email
    this.emailService.sendResetPasswordLink(
      user.email,
      reset_password_url,
    );

    return {
      email: data.email,
    } as IForgetPasswordResponse;
  }

  /**
   * @author sambhav
   * @param {object} data - ResetPasswordDto
   * @returns {object} IResetPasswordResponse
   * @description checks token and set new password
   */
  async resetPassword(data: ResetPasswordDto): Promise<IResetPasswordResponse> {
    const user = await this.usersEntity.findOne({
      where: {
      reset_password_token: data.token,
      },
    });
    if (!user) {
      throw new BadRequestException(
        'Invalid Reset Password Token',
        ERROR_CODES.INVALID_RESET_PASSWORD_TOKEN,
      );
    }

    await this.setNewPassword(user.id, data.newPassword);

    await this.usersEntity.save({
      reset_password_token: null,
      id: user.id,
    });

    return {
      token: data.token,
    };
  }
}
