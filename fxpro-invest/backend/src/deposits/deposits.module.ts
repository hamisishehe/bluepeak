import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from '../audit-logs/audit-log.entity';
import { Investment } from '../investments/investment.entity';
import { Notification } from '../notifications/notification.entity';
import { ReferralCommission } from '../referrals/referral-commission.entity';
import { SettingsModule } from '../settings/settings.module';
import { Transaction } from '../transactions/transaction.entity';
import { User } from '../users/user.entity';
import { Deposit } from './deposit.entity';
import { DepositsController } from './deposits.controller';
import { DepositsService } from './deposits.service';

@Module({
  imports: [TypeOrmModule.forFeature([Deposit, Investment, User, Transaction, Notification, ReferralCommission, AuditLog]), SettingsModule],
  controllers: [DepositsController],
  providers: [DepositsService],
})
export class DepositsModule {}

