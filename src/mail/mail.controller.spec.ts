import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from './mail.controller'; // Nome correto
import { MailService } from './mail.service';

describe('EmailController', () => { // Nome do controller
  let controller: EmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        {
          provide: MailService,
          useValue: {
            sendDynamicEmail: jest.fn().mockResolvedValue({ success: true }),
          },
        },
      ],
    }).compile();

    controller = module.get<EmailController>(EmailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should call mailService.sendDynamicEmail with correct params', async () => {
      const testData = {
        to: 'test@example.com',
        subject: 'Test Subject',
        content: '<p>Test content</p>',
        template: 'test-template',
        context: { name: 'Test User' },
      };

      await controller.sendEmail(testData);
      expect(MailService.prototype.sendDynamicEmail).toHaveBeenCalledWith(
        testData.to,
        testData.subject,
        testData.content,
        testData.template,
        testData.context
      );
    });
  });
});