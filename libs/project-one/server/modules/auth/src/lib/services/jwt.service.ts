import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtParsedTokenInterface } from '@mn/project-one/server/models';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { plainToInstance } from "class-transformer";
import { UserEntity } from '@mn/project-one/server/entities';
import { UserType } from '@mn/project-one/server/repos/repo-one';

@Injectable()
export class JwtService {

  constructor(private readonly nestJwtService: NestJwtService) {}

  async createAuthResponse(user: UserType): Promise<AuthResponseDto> {
    const payload: JwtParsedTokenInterface = {
      tenantId: user.tenantId,
      email: user.email,
      username: user.username,
      publicId: user.publicId,
      sub: user.id,
      roleId: user.role.id,
      permissions: user.role.permissions.map(permission => permission.permissionName)
    };

    const token = await this.nestJwtService.signAsync(payload);

    return {
      token,
      // Since UserWithRoleAndPermissionsEntity could actually have extra properties like the password
      // Therefore we solely exclude the properties of the model itself.
      user: plainToInstance(UserEntity, user, { excludeExtraneousValues: true })
    }
  }

  verify(token: string) {
    return !!this.nestJwtService.verify(token);
  }
}
