import { Controller, Get, Post, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ServerRouting } from '@mn/project-one/shared/models';
import { ApiImageFile, ApiPaginatedResponse, Pagination, TenantId } from '@mn/project-one/server/decorators';
import 'multer';
import { UserEntity } from '@mn/project-one/server/entities';
import { PaginationInterface, UserEntitySearchable } from '@mn/project-one/shared/sort-search-page';
import { Auth } from '@mn/project-one/server/guards';

@ApiTags(ServerRouting.user.capitalizedPath)
@Auth()
@Controller(ServerRouting.user.absolutePath())
export class UserController {
  constructor(
    private service: UserService,
  ) {}

  @ApiPaginatedResponse(UserEntity)
  @ApiOperation({ description: `Get all the users for a tenant.`})
  @Get()
  async findAll(
    @TenantId() tenantId: string,
    @Pagination({
      ...UserEntitySearchable
    }) dto: PaginationInterface
  ) {
    return this.service.findAllPaginated(tenantId, dto);
  }

  @ApiImageFile('avatar', true)
  @Post('update')
  async updateAvatar(@UploadedFile() file: Express.Multer.File) {
    return undefined;
  }
  // @Delete(ServerRouting.role.children.delete.path)
  // delete(@TenantId() tenantId: string, @Body() dto: DeleteRoleDto): Promise<SimpleResponseDto> {
  //   return this.service.deleteRole(tenantId, dto);
  // }
}
