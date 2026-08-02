import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserDecorator } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permission } from '../permissions/permission.enum';
import { CurrentUser } from '../auth/current-user';
import { DepositsService } from './deposits.service';
import { CreateAdminDepositDto } from './dto/create-admin-deposit.dto';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { RejectDepositDto } from './dto/reject-deposit.dto';

@ApiTags('deposits')
@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @Post('api/v1/deposits')
  @Permissions(Permission.DEPOSIT_CREATE)
  create(@CurrentUserDecorator() user: CurrentUser, @Body() dto: CreateDepositDto) {
    return this.depositsService.create(user, dto);
  }

  @Get('api/v1/deposits')
  @Permissions(Permission.DEPOSIT_VIEW_OWN)
  own(@CurrentUserDecorator() user: CurrentUser) {
    return this.depositsService.findOwn(user);
  }

  @Get('api/v1/admin/deposits')
  @Permissions(Permission.DEPOSIT_VIEW_ALL)
  all() {
    return this.depositsService.findAll();
  }

  @Post('api/v1/admin/deposits')
  @Permissions(Permission.DEPOSIT_APPROVE)
  createForUser(@CurrentUserDecorator() admin: CurrentUser, @Body() dto: CreateAdminDepositDto) {
    return this.depositsService.createForUser(admin, dto);
  }

  @Patch('api/v1/admin/deposits/:id/approve')
  @Permissions(Permission.DEPOSIT_APPROVE)
  approve(@Param('id') id: string, @CurrentUserDecorator() user: CurrentUser) {
    return this.depositsService.approve(id, user);
  }

  @Patch('api/v1/admin/deposits/:id/reject')
  @Permissions(Permission.DEPOSIT_REJECT)
  reject(@Param('id') id: string, @Body() dto: RejectDepositDto, @CurrentUserDecorator() user: CurrentUser) {
    return this.depositsService.reject(id, dto.reason, user);
  }
}
