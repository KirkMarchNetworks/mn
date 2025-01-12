import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { mock } from "jest-mock-extended";
import { UserRepo, UserWithPasswordType } from '@mn/project-one/server/repos/user-repo';
import { hashPassword } from '@mn/project-one/server/models';
import { JwtService } from './services/jwt.service';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '@mn/project-one/server/entities';
import { getQueueToken } from '@nestjs/bullmq';
import { PasswordResetQueueName, PasswordResetQueueType } from './processors/password-reset.processor';
import { UserNotVerifiedException } from './exceptions/user-not-verified.exception';
import { UserCreatedQueueName, UserCreatedQueueType } from './processors/user-created.processor';

const mockPassword = '1';
const mockEmailAddress = 'a@b.com';

const mockGetUserWithRoleAndPermissionsEntity = (verifiedEmail = true): UserEntity => ({
  email: '',
  id: '',
  publicId: '',
  role: {
    id: '',
    permissions: []
  },
  tenantId: '',
  username: '',
  enabled: true,
  verifiedEmail
});

const mockGetUserWithPasswordEntity = async (password: string, verifiedEmail = true) : Promise<UserWithPasswordType> => ({
  ...mockGetUserWithRoleAndPermissionsEntity(verifiedEmail),
  password: await hashPassword(password),
});

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: UserRepo;
  let jwtService : JwtService;

  const passwordResetQueueToken = getQueueToken(PasswordResetQueueName);
  let passwordResetQueue: PasswordResetQueueType;

  const userCreatedQueueToken = getQueueToken(UserCreatedQueueName);
  let userCreatedQueue: UserCreatedQueueType;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: passwordResetQueueToken,
          useValue: mock<PasswordResetQueueType>()
        },
        {
          provide: userCreatedQueueToken,
          useValue: mock<UserCreatedQueueType>()
        },
      ],
    })
      .useMocker(mock)
      .compile();

    service = module.get(AuthService);
    userRepo = module.get(UserRepo);
    jwtService = module.get(JwtService);
    passwordResetQueue = module.get(passwordResetQueueToken);
    userCreatedQueue = module.get(userCreatedQueueToken);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });

  describe('Successful Requests',() => {

    const findUserWithPasswordResponse = mockGetUserWithPasswordEntity(mockPassword);
    const mockCreateAuthResponse: AuthResponseDto = {
      user: mockGetUserWithRoleAndPermissionsEntity(),
      token: '1'
    }

    it('should login the user successfully using an email address', async () => {
      const spy1 = jest.spyOn(userRepo, 'findUserWithPasswordFromTenantNameAndEmail').mockResolvedValueOnce(findUserWithPasswordResponse);
      const spy2 = jest.spyOn(jwtService, 'createAuthResponse').mockResolvedValueOnce(mockCreateAuthResponse)

      const user = await service.login({
        tenantName: '',
        emailOrUsername: 'user1@tenant1.com',
        password: mockPassword
      })

      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
      expect(user).toBe(mockCreateAuthResponse);
    });

    it('should login the user successfully using a username', async () => {
      const spy1 = jest.spyOn(userRepo, 'findUserWithPasswordFromTenantNameAndUsername').mockResolvedValueOnce(findUserWithPasswordResponse);
      const spy2 = jest.spyOn(jwtService, 'createAuthResponse').mockResolvedValueOnce(mockCreateAuthResponse)

      const user = await service.login({
        tenantName: '',
        emailOrUsername: 'user1',
        password: '1'
      })

      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
      expect(user).toBe(mockCreateAuthResponse);
    });

    it('should never pass the password to createAuthResponse', async () => {
      // TODO: Complete this properly
      const spy1 = jest.spyOn(userRepo, 'findUserWithPasswordFromTenantNameAndUsername').mockResolvedValueOnce(findUserWithPasswordResponse);
      const spy2 = jest.spyOn(jwtService, 'createAuthResponse').mockResolvedValueOnce(mockCreateAuthResponse)

      const user = await service.login({
        tenantName: '',
        emailOrUsername: 'user1',
        password: '1'
      })

      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
      expect(user).toBe(mockCreateAuthResponse);
    });

  });


  it('should return UnauthorizedException, if email or username is not found.', async () => {
    expect.assertions(1);
    jest.spyOn(userRepo, 'findUserWithPasswordFromTenantNameAndEmail').mockResolvedValueOnce(null);

    await expect(service.login({ tenantName: '', emailOrUsername: mockEmailAddress, password: '' })).rejects.toThrow(
      UnauthorizedException
    );
  });

  it('should return UnauthorizedException, if password is incorrect.', async () => {
    expect.assertions(1);
    jest.spyOn(userRepo, 'findUserWithPasswordFromTenantNameAndUsername').mockResolvedValueOnce(mockGetUserWithPasswordEntity(mockPassword));

    const incorrectPassword = mockPassword + '@';

    await expect(service.login({ tenantName: '', emailOrUsername: mockEmailAddress, password: incorrectPassword })).rejects.toThrow(
      UnauthorizedException
    );
  });

  it(`should return UserNotVerifiedException, if the user's email address has not been verified.`, async () => {
    expect.assertions(1);

    const unverifiedUser = mockGetUserWithPasswordEntity(mockPassword, false);

    jest.spyOn(userRepo, 'findUserWithPasswordFromTenantNameAndEmail').mockResolvedValueOnce(unverifiedUser);

    await expect(service.login({ tenantName: '', emailOrUsername: mockEmailAddress, password: mockPassword })).rejects.toThrow(
      UserNotVerifiedException
    );
  });
});
