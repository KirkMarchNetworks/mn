import { Test } from '@nestjs/testing';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
