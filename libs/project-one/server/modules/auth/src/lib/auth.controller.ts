import { Body, Controller, NotFoundException, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionNames, ServerRouting } from '@mn/project-one/shared/models';
import { ApiAuthCreatedResponse } from './decorators/api-auth-created-response.decorator';
import { LoginRequestDto } from './dtos/login-request.dto';
import { ForgotPasswordRequestDto } from './dtos/forgot-password-request.dto';
import { UpdateEmailRequestDto } from './dtos/update-email-request.dto';
import { ResetPasswordRequestDto } from './dtos/reset-password-request.dto';
import {
  EmailExistsException,
  TemplatedApiException,
  UsernameExistsException
} from '@mn/project-one/server/exceptions';
import { UserNotVerifiedException } from './exceptions/user-not-verified.exception';
import { ConfirmEmailRequestDto } from './dtos/confirm-email-request.dto';
import { AuthAndPermissions } from '@mn/project-one/server/guards';
import { CreateUserRequestDto } from './dtos/create-user-request.dto';
import { TenantId } from '@mn/project-one/server/decorators';


@ApiTags(ServerRouting.auth.capitalizedPath)
@Controller(ServerRouting.auth.absolutePath())
export class AuthController {
  constructor(
    private service: AuthService
  ) {
  }

  @ApiOperation({ description: `Log into the application.` })
  @ApiAuthCreatedResponse()
  @TemplatedApiException(() => [
    UnauthorizedException,
    UserNotVerifiedException
  ])
  @Post(ServerRouting.auth.children.login.path)
  login(@Body() dto: LoginRequestDto) {
    return this.service.login(dto);
  }

  @ApiOperation({ description: `Begin resetting a user's password.` })
  @Post(ServerRouting.auth.children.forgotPassword.path)
  forgotPassword(@Body() dto: ForgotPasswordRequestDto) {
    return this.service.forgotPassword(dto);
  }

  @ApiOperation({ description: `Finish resetting a user's password.` })
  @ApiAuthCreatedResponse()
  @Post(ServerRouting.auth.children.resetPassword.path)
  resetPassword(@Body() dto: ResetPasswordRequestDto) {
    return this.service.resetPassword(dto);
  }

  @ApiOperation({ description: `Confirm a user's email and set their password.` })
  @ApiAuthCreatedResponse()
  @TemplatedApiException(() => [
    NotFoundException
  ])
  @Post(ServerRouting.auth.children.confirmEmail.path)
  confirmEmail(@Body() dto: ConfirmEmailRequestDto) {
    return this.service.confirmEmail(dto);
  }

  @ApiOperation({ description: `Update a user's email address.` })
  @ApiAuthCreatedResponse()
  @TemplatedApiException(() => [
    EmailExistsException,
    NotFoundException
  ])
  @Post(ServerRouting.auth.children.updateEmail.path)
  updateEmail(@Body() dto: UpdateEmailRequestDto) {
    return this.service.updateEmail(dto);
  }

  // Authenticated Routes
  //
  //
  @AuthAndPermissions(PermissionNames.CreateUser)
  @ApiOperation({
    description: `Creates a new user for a tenant.`
  })
  @TemplatedApiException(() => [
    EmailExistsException,
    UsernameExistsException
  ])
  @Post(ServerRouting.auth.children.createUser.path)
  createUser(@TenantId() tenantId: string, @Body() dto: CreateUserRequestDto) {
    return this.service.createUser(tenantId, dto);
  }
}
