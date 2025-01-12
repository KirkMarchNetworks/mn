import { Test } from '@nestjs/testing';
import { FileService } from './file.service';

describe('ProjectOneServerFileService', () => {
  let service: FileService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    service = module.get(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
