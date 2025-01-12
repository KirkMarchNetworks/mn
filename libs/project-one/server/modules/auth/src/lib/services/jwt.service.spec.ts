import { Test } from '@nestjs/testing';
import { mock } from "jest-mock-extended";
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtService } from './jwt.service';
import { UserWithRoleAndPermissionsEntity } from '@mn/project-one/server/schema-one';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthResponseDto } from '../dtos/auth-response.dto';

const mockUser: UserWithRoleAndPermissionsEntity = ({
  email: '',
  id: '',
  publicId: '',
  role: {
    id: '',
    permissions: []
  },
  tenantId: '',
  username: '',
  verifiedEmail: true,
});

describe('JwtService', () => {
  let service: JwtService;
  let nestJwtService: NestJwtService;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module = await Test.createTestingModule({
      providers: [JwtService],
    })
      .useMocker(mock)
      .compile();

    service = module.get(JwtService);
    nestJwtService = module.get(NestJwtService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });

  it('should create a successful response', async () => {

    const token = 'abc123';
    const spy1 = jest.spyOn(nestJwtService, 'signAsync').mockResolvedValueOnce(token);

    const passwordPropName = 'password';
    const randomPropName = 'randomProp';

    const mockUserWithExtraProps = {
      ...mockUser,
      [passwordPropName]: '123456',
      [randomPropName]: 89
    }

    const res = await service.createAuthResponse(mockUserWithExtraProps);

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(res.token).toBe(token);
    expect(res.user).toBeInstanceOf(UserWithRoleAndPermissionsEntity);
    expect(res.user).not.toHaveProperty(passwordPropName);
    expect(res.user).not.toHaveProperty(randomPropName);
  });
});
