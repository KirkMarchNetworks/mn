import { Body, Controller, Delete, NotImplementedException, Post } from '@nestjs/common';
import { SuperAdminRoleId, ServerRouting } from '@mn/project-one/shared/models';
import { AuthAndRole } from '@mn/project-one/server/guards';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TemplatedApiException } from '@mn/project-one/server/exceptions';
import { CreateLicensedProductRequestDto } from './dtos/create-licensed-product-request.dto';
import { LicensedProductService } from './licensed-product.service';

@ApiTags(ServerRouting.licensedProduct.capitalizedPath)
@AuthAndRole(SuperAdminRoleId)
@Controller(ServerRouting.licensedProduct.absolutePath())
export class LicensedProductController {
  constructor(
    private service: LicensedProductService
  ) {}

  @ApiOperation({ description: `Create a new license.` })
  @TemplatedApiException(() => NotImplementedException)
  @Post(ServerRouting.licensedProduct.children.create.path)
  create(@Body() dto: CreateLicensedProductRequestDto) {
    return this.service.addLicensedProduct(dto);
  }
}
