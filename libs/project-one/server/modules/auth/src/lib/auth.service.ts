import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginRequestDto } from './dtos/login-request.dto';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { JwtService } from './services/jwt.service';
import {
  UserWithPasswordResetType,
  UserRepo,
  UserWithPasswordType,
  CreateUserType, CreateVerifiedUserType
} from '@mn/project-one/server/repos/user';
import { isEmail } from 'class-validator';
import { generateId, hashPassword, verifyPassword } from '@mn/project-one/server/models';
import { ForgotPasswordRequestDto } from './dtos/forgot-password-request.dto';
import { InjectPasswordResetQueue, PasswordResetQueueType } from './processors/password-reset.processor';
import { SimpleResponseDto } from '@mn/project-one/server/dtos';
import { UpdateEmailRequestDto } from './dtos/update-email-request.dto';
import { ResetPasswordRequestDto } from './dtos/reset-password-request.dto';
import { UserNotVerifiedException } from './exceptions/user-not-verified.exception';
import { ConfirmEmailRequestDto } from './dtos/confirm-email-request.dto';
import { InjectUserCreatedQueue, UserCreatedQueueType } from './processors/user-created.processor';
import { UserNotEnabledException } from './exceptions/user-not-enabled.exception';
import { PasswordRequiredException } from './exceptions/password-required.exception';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private userRepo: UserRepo,
    @InjectPasswordResetQueue() private passwordResetQueue: PasswordResetQueueType,
    @InjectUserCreatedQueue() private userCreatedQueue: UserCreatedQueueType,
  ) {}

  async login(dto: LoginRequestDto): Promise<AuthResponseDto> {
    const { tenantName, emailOrUsername, password } = dto;

    let user: UserWithPasswordType|null;

    if (isEmail(emailOrUsername)) {
      user = await this.userRepo.findUserWithPasswordFromTenantNameAndEmail(tenantName, emailOrUsername);
    } else {
      user = await this.userRepo.findUserWithPasswordFromTenantNameAndUsername(tenantName, emailOrUsername);
    }

    if (!user) {
      console.log(`EmailOrUsername: ${emailOrUsername} not found in the DB for Tenant name: ${tenantName}`);
      throw new UnauthorizedException();
    }

    if (user.password === null) {
      throw new UserNotVerifiedException();
    }

    if (! await verifyPassword(user.password, password)) {
      console.log(`Incorrect password for EmailOrUsername: ${emailOrUsername} entered for Tenant name: ${tenantName}`);
      throw new UnauthorizedException();
    }

    if (! user.verifiedEmail) {
      throw new UserNotVerifiedException();
    }

    if (! user.enabled) {
      throw new UserNotEnabledException()
    }

    return await this.jwtService.createAuthResponse(user);
  }

  async forgotPassword({ tenantName, emailOrUsername }: ForgotPasswordRequestDto): Promise<SimpleResponseDto> {

    let user: UserWithPasswordResetType | null;
    // To increase security we always return success with this method, whether the tenant, email and/or username exists or not.
    const response: SimpleResponseDto = { success: true };

    if (isEmail(emailOrUsername)) {
      user = await this.userRepo.findUserWithPasswordResetFromTenantNameAndEmail(tenantName, emailOrUsername);
    } else {
      user = await this.userRepo.findUserWithPasswordResetFromTenantNameAndUsername(tenantName, emailOrUsername);
    }

    if (!user) {
      console.log(`EmailOrUsername: ${emailOrUsername} not found in the DB for Tenant name: ${tenantName}`);
      return response;
    }

    // TODO: Confirm it's within allocated timeframe
    if (user.passwordReset?.createdAt) {
      // Maybe we can return a better error message for this scenario
    }

    const token = generateId();

    await this.userRepo.addPasswordResetToken({
      id: user.id,
      token
    });

    await this.passwordResetQueue.add(generateId(), {
      user,
      token
    })

    return {
      success: true
    }
  }

  async resetPassword(dto: ResetPasswordRequestDto) {

    const res = await this.userRepo.findPasswordReset(dto);

    // TODO: Confirm it's within allocated timeframe
    if (res && res.passwordReset) {
      const hashedPassword = await this._confirmPasswordValidityAndHashIt(dto.password);
      const user = await this.userRepo.setPasswordAndRemovePasswordResetToken(res.id, hashedPassword);
      return await this.jwtService.createAuthResponse(user);
    }

    throw new NotFoundException();
  }

  async updateEmail(dto: UpdateEmailRequestDto) {
    const res = await this.userRepo.findUpdateEmail(dto);

    // TODO: Confirm it's within allocated timeframe
    if (res && res.updateEmail) {
      const user = await this.userRepo.updateUserEmail(res.tenantId, res.id, res.updateEmail.email);
      return await this.jwtService.createAuthResponse(user);
    }

    throw new NotFoundException();
  }

  async confirmEmail(dto: ConfirmEmailRequestDto) {
    const res = await this.userRepo.findConfirmEmail(dto);

    // TODO: Confirm it's within allocated timeframe
    if (res && res.confirmEmail) {
      const hashedPassword = await this._confirmPasswordValidityAndHashIt(dto.password);
      const user = await this.userRepo.updateUserPasswordAndEmailVerification(
        res.id,
        hashedPassword
      );
      return await this.jwtService.createAuthResponse(user);
    }

    throw new NotFoundException();
  }

  async createUser(tenantId: string, dto: CreateUserType) {
    const confirmEmailToken = generateId();

    const user = await this.userRepo.createUserWithConfirmEmailToken(tenantId, dto, confirmEmailToken);

    await this.userCreatedQueue.add(generateId(), { user, confirmEmailToken });

    return user;
  }

  async createVerifiedUser(tenantId: string, dto: CreateVerifiedUserType) {
    const { password } = dto;

    if (password === null) {
      throw new PasswordRequiredException();
    }

    dto = {
      ...dto,
      password: await this._confirmPasswordValidityAndHashIt(password)
    };

    return await this.userRepo.createVerifiedUser(tenantId, dto);
  }

  async _confirmPasswordValidityAndHashIt(password: string) {
    // TODO: Validate password from rules
    return await hashPassword(password);
  }
}
