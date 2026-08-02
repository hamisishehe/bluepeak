import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferralCommission } from './referral-commission.entity';
import { ReferralsController } from './referrals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ReferralCommission])],
  controllers: [ReferralsController],
})
export class ReferralsModule {}

