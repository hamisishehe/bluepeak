import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUser } from '../auth/current-user';
import { CurrentUserDecorator } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permission } from '../permissions/permission.enum';
import { ReferralCommission } from './referral-commission.entity';

@ApiTags('referrals')
@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReferralsController {
  constructor(@InjectRepository(ReferralCommission) private readonly referrals: Repository<ReferralCommission>) {}
  @Get('api/v1/referrals')
  @Permissions(Permission.REFERRAL_VIEW_OWN)
  own(@CurrentUserDecorator() user: CurrentUser) {
    return this.referrals.find({ where: { referrerUserId: user.id }, order: { createdAt: 'DESC' } });
  }
  @Get('api/v1/admin/referrals')
  @Permissions(Permission.REFERRAL_VIEW_ALL)
  all() {
    return this.referrals.find({ order: { createdAt: 'DESC' }, take: 100 });
  }
}

