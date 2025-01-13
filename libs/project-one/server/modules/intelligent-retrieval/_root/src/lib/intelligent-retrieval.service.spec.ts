import { Test } from '@nestjs/testing';
import { IntelligentRetrievalService } from './intelligent-retrieval.service';

describe('ProjectOneServerImageService', () => {
  let service: IntelligentRetrievalService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [IntelligentRetrievalService],
    }).compile();

    service = module.get(IntelligentRetrievalService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
