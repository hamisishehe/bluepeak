import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserDecorator } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permission } from '../permissions/permission.enum';
import { CurrentUser } from '../auth/current-user';
import { ProfitsService } from './profits.service';

@ApiTags('profits')
@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProfitsController {
  constructor(private readonly profitsService: ProfitsService) {}
  @Get('api/v1/profits')
  @Permissions(Permission.PROFIT_VIEW_OWN)
  own(@CurrentUserDecorator() user: CurrentUser) {
    return this.profitsService.findOwn(user);
  }
  @Get('api/v1/admin/profits')
  @Permissions(Permission.PROFIT_VIEW_ALL)
  all() {
    return this.profitsService.findAll();
  }
}

