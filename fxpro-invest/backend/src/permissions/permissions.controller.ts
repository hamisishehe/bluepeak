import { Controller, Get, UseGuards } from '@nestjs/common';
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permission } from './permission.enum';
import { rolePermissions } from './role-permissions';

@Controller('api/v1/admin/roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PermissionsController {
  @Get()
  @Permissions(Permission.ADMIN_MANAGE)
  roles() {
    return rolePermissions;
  }
}

