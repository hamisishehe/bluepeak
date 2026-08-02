import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permission } from '../permissions/permission.enum';

@ApiTags('reports')
@Controller('api/v1/admin/reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReportsController {
  @Get()
  @Permissions(Permission.REPORTS_VIEW)
  summary() {
    return { deposits: 'Use /api/v1/admin/deposits', withdrawals: 'Use /api/v1/admin/withdrawals', profits: 'Use /api/v1/admin/profits' };
  }
}

