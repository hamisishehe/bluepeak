import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserDecorator } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permission } from '../permissions/permission.enum';
import { CurrentUser } from '../auth/current-user';
import { InvestmentStatus } from './investment.entity';
import { InvestmentsService } from './investments.service';

@ApiTags('investments')
@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}
  @Get('api/v1/investments')
  @Permissions(Permission.INVESTMENT_VIEW_OWN)
  own(@CurrentUserDecorator() user: CurrentUser) {
    return this.investmentsService.findOwn(user);
  }
  @Get('api/v1/admin/investments')
  @Permissions(Permission.INVESTMENT_VIEW_ALL)
  all() {
    return this.investmentsService.findAll();
  }
  @Patch('api/v1/admin/investments/:id/pause')
  @Permissions(Permission.INVESTMENT_PAUSE)
  pause(@Param('id') id: string, @Body('reason') reason: string) {
    return this.investmentsService.updateStatus(id, InvestmentStatus.PAUSED, reason);
  }
  @Patch('api/v1/admin/investments/:id/resume')
  @Permissions(Permission.INVESTMENT_PAUSE)
  resume(@Param('id') id: string, @Body('reason') reason: string) {
    return this.investmentsService.updateStatus(id, InvestmentStatus.ACTIVE, reason);
  }
  @Patch('api/v1/admin/investments/:id/cancel')
  @Permissions(Permission.INVESTMENT_CANCEL)
  cancel(@Param('id') id: string, @Body('reason') reason: string) {
    return this.investmentsService.updateStatus(id, InvestmentStatus.CANCELLED, reason);
  }
}

