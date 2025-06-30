import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('MailService', () => {
  let service: MailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendDynamicEmail', () => {
    it('should send email with HTML content', async () => {
      const options = {
        to: 'user@example.com',
        subject: 'Test HTML',
        content: '<p>HTML content</p>',
      };

      await service.sendDynamicEmail(
        options.to,
        options.subject,
        options.content
      );

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: options.to,
        subject: options.subject,
        html: options.content,
      });
    });

    it('should send email with template', async () => {
      const options = {
        to: 'user@example.com',
        subject: 'Test Template',
        template: 'test',
        context: { name: 'John' },
      };

      await service.sendDynamicEmail(
        options.to,
        options.subject,
        '', // content vazio
        options.template,
        options.context
      );

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: options.to,
        subject: options.subject,
        template: options.template,
        context: options.context,
      });
    });
  });
});