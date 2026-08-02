import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permission } from '../permissions/permission.enum';
import { AuditLogsService } from './audit-logs.service';

@ApiTags('audit-logs')
@Controller('api/v1/admin/audit-logs')
@UseGuards(PermissionsGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}
  @Get()
  @Permissions(Permission.AUDIT_LOG_VIEW)
  findAll() {
    return this.auditLogsService.findAll();
  }
}
