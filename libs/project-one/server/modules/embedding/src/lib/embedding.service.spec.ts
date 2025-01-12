import { Test } from '@nestjs/testing';
import { EmbeddingService } from './embedding.service';

describe('EmbeddingService', () => {
  let service: EmbeddingService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EmbeddingService],
    }).compile();

    service = module.get(EmbeddingService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
