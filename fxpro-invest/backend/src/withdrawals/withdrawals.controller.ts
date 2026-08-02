import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUserDecorator } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permission } from '../permissions/permission.enum';
import { CurrentUser } from '../auth/current-user';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { WithdrawalStatus } from './withdrawal.entity';
import { WithdrawalsService } from './withdrawals.service';

@ApiTags('withdrawals')
@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) {}
  @Post('api/v1/withdrawals')
  @Permissions(Permission.WITHDRAWAL_CREATE)
  create(@CurrentUserDecorator() user: CurrentUser, @Body() dto: CreateWithdrawalDto) {
    return this.withdrawalsService.create(user, dto);
  }
  @Get('api/v1/withdrawals')
  @Permissions(Permission.WITHDRAWAL_VIEW_OWN)
  own(@CurrentUserDecorator() user: CurrentUser) {
    return this.withdrawalsService.findOwn(user);
  }
  @Get('api/v1/admin/withdrawals')
  @Permissions(Permission.WITHDRAWAL_VIEW_ALL)
  all() {
    return this.withdrawalsService.findAll();
  }
  @Patch('api/v1/admin/withdrawals/:id/approve')
  @Permissions(Permission.WITHDRAWAL_APPROVE)
  approve(@Param('id') id: string, @CurrentUserDecorator() user: CurrentUser) {
    return this.withdrawalsService.transition(id, WithdrawalStatus.APPROVED, user);
  }
  @Patch('api/v1/admin/withdrawals/:id/process')
  @Permissions(Permission.WITHDRAWAL_PROCESS)
  process(@Param('id') id: string, @CurrentUserDecorator() user: CurrentUser) {
    return this.withdrawalsService.transition(id, WithdrawalStatus.PROCESSING, user);
  }
  @Patch('api/v1/admin/withdrawals/:id/pay')
  @Permissions(Permission.WITHDRAWAL_PAY)
  pay(@Param('id') id: string, @CurrentUserDecorator() user: CurrentUser) {
    return this.withdrawalsService.transition(id, WithdrawalStatus.PAID, user);
  }
  @Patch('api/v1/admin/withdrawals/:id/reject')
  @Permissions(Permission.WITHDRAWAL_REJECT)
  reject(@Param('id') id: string, @CurrentUserDecorator() user: CurrentUser) {
    return this.withdrawalsService.transition(id, WithdrawalStatus.REJECTED, user, 'Rejected by administrator');
  }
}

