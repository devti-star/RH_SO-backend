// email.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('emails')
export class EmailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendEmail(
    @Body()
    body: {
      to: string;
      subject: string;
      content: string;
      template?: string;
      context?: Record<string, any>;
    }
  ) {
    return this.mailService.sendDynamicEmail(
      body.to,
      body.subject,
      body.content,
      body.template,
      body.context
    );
  }
}