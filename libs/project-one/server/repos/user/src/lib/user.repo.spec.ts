import { Test } from '@nestjs/testing';
import { UserRepo } from './user.repo';

describe('UsersRepoService', () => {
  let service: UserRepo;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepo],
    }).compile();

    service = module.get(UserRepo);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
