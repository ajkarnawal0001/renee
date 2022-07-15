import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ServerClient } from 'postmark';
import {
  POSTMARK_API_TOKEN,
  POSTMARK_FROM_EMAIL,
  POSTMARK_RESET_PASSWORD_LINK_TEMPLATE_ID,
} from 'src/core/environment/index';
import { ERROR_CODES } from '@errors';

@Injectable()
export class EmailService {
  private errMsg = 'Error while sending Email';
  private readonly postmarkClient: ServerClient;
  constructor() {
    this.postmarkClient = new ServerClient(POSTMARK_API_TOKEN);
  }

  async sendResetPasswordLink(
        email: string,
        reset_url: string,
    ): Promise<void> {
    try{
      await this.postmarkClient.sendEmailWithTemplate({
            From: POSTMARK_FROM_EMAIL,
            To: email,
            TemplateId: POSTMARK_RESET_PASSWORD_LINK_TEMPLATE_ID,
            TemplateModel: {
                action_url: reset_url,
            },
        });
      }
    catch (error) {
            Logger.error(error, '', 'POSTMARK');
            throw new InternalServerErrorException(
                this.errMsg,
                ERROR_CODES.POSTMARK_ERROR,
            );
        }
  }

  // async sendInvitation(payload: {
  //   invitationUrl: string;
  //   productName: string;
  //   receiverName: string;
  //   senderName: string;
  // }) {
  //   try {
  //     return this.postmarkClient.sendEmailWithTemplate({
  //       From: POSTMARK_FROM_EMAIL,
  //       To: payload.receiverName,
  //       TemplateId: POSTMARK_ADMIN_INVITATION_TEMPLATE_ID,
  //       TemplateModel: {
  //         name: payload.receiverName,
  //         invite_sender_name: payload.senderName,
  //         product_name: payload.productName,
  //         action_url: payload.invitationUrl,
  //       },
  //     });
  //   } catch (error) {
  //     Logger.error(error, '', 'POSTMARK');
  //     throw new InternalServerErrorException(
  //       this.errMsg,
  //       ERROR_CODES.POSTMARK_ERROR,
  //     );
  //   }
  // }

  // async sendOtpEmail(payload: {
  //   productName: string;
  //   receiverEmail: string[];
  //   otp: string;
  // }) {
  //   try {
  //     return this.postmarkClient.sendEmailWithTemplate({
  //       From: POSTMARK_FROM_EMAIL,
  //       To: payload.receiverEmail.join(','),
  //       TemplateId: POSTMARK_OTP_TEMPLATE_ID,
  //       TemplateModel: {
  //         product_name: payload.productName,
  //         otp: payload.otp,
  //       },
  //     });
  //   } catch (error) {
  //     Logger.error(error, '', 'POSTMARK');
  //     throw new InternalServerErrorException(
  //       this.errMsg,
  //       ERROR_CODES.POSTMARK_ERROR,
  //     );
  //   }
  // }
}
