import { Test } from '@nestjs/testing';
import { SimpleStorageService } from './simple-storage.service';

describe('ProjectOneServerSimpleStorageService', () => {
  let service: SimpleStorageService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SimpleStorageService],
    }).compile();

    service = module.get(SimpleStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
