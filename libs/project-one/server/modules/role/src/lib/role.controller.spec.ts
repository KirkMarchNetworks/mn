import { Test } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

describe('ProjectOneServerRoleController', () => {
  let controller: RoleController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [RoleService],
      controllers: [RoleController],
    }).compile();

    controller = module.get(RoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
