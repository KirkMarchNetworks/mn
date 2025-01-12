import { Test } from '@nestjs/testing';
import { IntelligentRetrievalRepo } from './intelligent-retrieval.repo';

describe('ProjectOneServerReposIntelligentRetrievalService', () => {
  let service: IntelligentRetrievalRepo;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [IntelligentRetrievalRepo],
    }).compile();

    service = module.get(IntelligentRetrievalRepo);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
