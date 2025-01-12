import { Injectable } from '@nestjs/common';
import { RepoOneService } from '@mn/project-one/server/repos/repo-one';
import { UserType, userSelect } from '@mn/project-one/server/repos/repo-one';
import { userWithPasswordSelect, UserWithPasswordType } from './types/user-with-password.type';
import { generateId } from '@mn/project-one/server/models';
import { Prisma } from '@prisma/project-one/one';
import { userWithPasswordResetSelect, UserWithPasswordResetType } from './types/user-with-password-reset.type';
import { CreateUserType } from './types/create-user.type';
import { FindFirstTokenInterface } from './models/find-first-token.interface';
import { CreateVerifiedUserType } from './types/create-verified-user.type';
import { EmailExistsException, UsernameExistsException } from '@mn/project-one/server/exceptions';
import { SharedRepo } from '@mn/project-one/server/repos/shared';
import { UserPaginationType } from './types/user-pagination.type';

@Injectable()
export class UserRepo {

  constructor(
    private repoOneService: RepoOneService,
    private sharedRepoService: SharedRepo
  ) {
  }

  async updateUserEmail(tenantId: string, userId: string, email: string) {
    return await this.repoOneService.$transaction(async () => {
      await this._confirmEmailDoesntExistOrThrow(tenantId, email);

      return this._updateUserEmail(userId, email);
    })
  }

  async getUserCountForTenant(tenantId: string, params: UserPaginationType) {
    const where = {
      ...params.where,
      tenantId
    };

    return await this.repoOneService.user.count({
      where
    });
  }

  async getUsers(tenantId: string, params: UserPaginationType) {
    params.where = {
      ...params.where,
      tenantId
    }
    return await this.repoOneService.user.findMany({
      ...params,
      select: userSelect
    });
  }

  async updateUserPasswordAndEmailVerification(
    userId: string,
    password: string
  ) {
    return await this.repoOneService.user.update({
      where: {
        id: userId
      },
      data: {
        password,
        verifiedEmail: true,
        confirmEmail: {
          delete: true
        }
      },
      select: userSelect
    })
  }

  async findUpdateEmail({ id, token } : FindFirstTokenInterface) {
    return await this.repoOneService.user.findFirst({
      where: {
        id,
        updateEmail: {
          token
        }
      },
      select: {
        id: true,
        tenantId: true,
        updateEmail: {
          select: {
            email: true,
            createdAt: true
          }
        }
      }
    })
  }

  async findConfirmEmail({ id, token } : FindFirstTokenInterface) {
    return await this.repoOneService.user.findFirst({
      where: {
        id,
        confirmEmail: {
          token
        }
      },
      select: {
        id: true,
        tenantId: true,
        confirmEmail: {
          select: {
            email: true,
            createdAt: true
          }
        }
      }
    })
  }

  async findPasswordReset({ id, token } : FindFirstTokenInterface) {
    return await this.repoOneService.user.findFirst({
      where: {
        id,
        passwordReset: {
          token
        }
      },
      select: {
        id: true,
        passwordReset: {
          select: {
            createdAt: true
          }
        }
      }
    })
  }

  async addPasswordResetToken({ id, token } : { id: string, token: string }) {
    return await this.repoOneService.user.update({
      where: {
        id
      },
      data: {
        passwordReset: {
          create: {
            token
          }
        }
      }
    })
  }

  async setPasswordAndRemovePasswordResetToken(userId: string, password: string) {
    return await this.repoOneService.user.update({
      where: {
        id: userId,
      },
      data: {
        password,
        passwordReset: {
          delete: true
        }
      },
      select: userSelect
    })
  }

  async findUserWithPasswordFromTenantNameAndEmail(tenantName: string, email: string): Promise<UserWithPasswordType|null> {
    return await this.repoOneService.user.findFirst({
      where: this._getFindEmailWhereClause(tenantName, email),
      select: userWithPasswordSelect
    });
  }

  async findUserWithPasswordFromTenantNameAndUsername(tenantName: string, username: string): Promise<UserWithPasswordType|null> {
    return await this.repoOneService.user.findFirst({
      where: this._getFindUsernameWhereClause(tenantName, username),
      select: userWithPasswordSelect
    });
  }

  async findUserWithPasswordResetFromTenantNameAndEmail(tenantName: string, email: string): Promise<UserWithPasswordResetType|null> {
    return await this.repoOneService.user.findFirst({
      where: this._getFindEmailWhereClause(tenantName, email),
      select: userWithPasswordResetSelect
    });
  }

  async findUserWithPasswordResetFromTenantNameAndUsername(tenantName: string, username: string): Promise<UserWithPasswordResetType|null> {
    return await this.repoOneService.user.findFirst({
      where: this._getFindUsernameWhereClause(tenantName, username),
      select: userWithPasswordResetSelect
    });
  }

  async createUserWithConfirmEmailToken(tenantId: string, user: CreateUserType, confirmEmailToken: string): Promise<UserType> {
    return await this.repoOneService.$transaction(async () => {
      await this._confirmRoleExistsAndEmailAndUsernameDoesntExistOrThrow(tenantId, user);

      return await this.repoOneService.user.create({
        data: {
          ...user,
          tenantId,
          publicId: generateId(),
          confirmEmail: {
            create: {
              email: user.email,
              token: confirmEmailToken
            }
          }
        },
        select: userSelect
      });
    })
  }

  async createVerifiedUser(tenantId: string, user: CreateVerifiedUserType): Promise<UserType> {
    return await this.repoOneService.$transaction(async () => {
      await this._confirmRoleExistsAndEmailAndUsernameDoesntExistOrThrow(tenantId, user);

      return await this.repoOneService.user.create({
        data: {
          ...user,
          tenantId,
          publicId: generateId(),
          verifiedEmail: true
        },
        select: userSelect
      });
    })
  }

  private async _updateUserEmail(id: string, email: string) {
    return await this.repoOneService.user.update({
      where: {
        id
      },
      data: {
        email,
        updateEmail: {
          delete: true
        }
      },
      select: userSelect
    })
  }

  private _getFindEmailWhereClause(tenantName: string, email: string) {
    return {
      AND: [
        {
          tenant: {
            name: {
              equals: tenantName,
              mode: 'insensitive'
            }
          }
        },
        {
          email: {
            equals: email,
            mode: 'insensitive'
          }
        },
        {
          deletedAt: null
        }
      ]
    } as Prisma.UserWhereInput
  }

  private _getFindUsernameWhereClause(tenantName: string, username: string) {
    return {
      AND: [
        {
          tenant: {
            name: {
              equals: tenantName,
              mode: 'insensitive'
            }
          }
        },
        {
          username: {
            equals: username,
            mode: 'insensitive'
          }
        },
        {
          deletedAt: null
        }
      ]
    } as Prisma.UserWhereInput
  }

  private async _findUserFromUsernameWithTrashed(tenantId: string, username: string) {
    return await this.repoOneService.user.findFirst({
      where: {
        AND: [
          {
            tenantId
          },
          {
            username: {
              equals: username,
              mode: 'insensitive'
            }
          },
        ]
      },
      select: {
        id: true
      }
    });
  }

  private async _findUserFromEmailWithTrashed(tenantId: string, email: string) {
    return await this.repoOneService.user.findFirst({
      where: {
        AND: [
          {
            tenantId
          },
          {
            email: {
              equals: email,
              mode: 'insensitive'
            }
          },
        ]
      },
      select: {
        id: true
      }
    });
  }

  private async _confirmEmailDoesntExistOrThrow(tenantId: string, email: string) {
    const exists = await this._findUserFromEmailWithTrashed(
      tenantId,
      email
    );

    if (exists) {
      throw new EmailExistsException();
    }
  }

  private async _confirmUsernameDoesntExistOrThrow(tenantId: string, username: string) {
    const exists = await this._findUserFromUsernameWithTrashed(
      tenantId,
      username
    );

    if (exists) {
      throw new UsernameExistsException();
    }
  }

  private async _confirmRoleExistsAndEmailAndUsernameDoesntExistOrThrow(tenantId: string, user: CreateUserType) {
    await this.sharedRepoService.confirmRoleIdBelongsToTenantOrThrow(tenantId, user.roleId);
    await this._confirmEmailDoesntExistOrThrow(tenantId, user.email);
    await this._confirmUsernameDoesntExistOrThrow(tenantId, user.username);
  }
}
