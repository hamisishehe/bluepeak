import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { AuthModule } from './auth/auth.module';
import { AuthSession } from './auth/auth-session.entity';
import { PasswordResetToken } from './auth/password-reset-token.entity';
import { Deposit } from './deposits/deposit.entity';
import { DepositsModule } from './deposits/deposits.module';
import { HealthModule } from './health/health.module';
import { Investment } from './investments/investment.entity';
import { InvestmentsModule } from './investments/investments.module';
import { Notification } from './notifications/notification.entity';
import { Profit } from './profits/profit.entity';
import { ProfitsModule } from './profits/profits.module';
import { ReferralCommission } from './referrals/referral-commission.entity';
import { ReportsModule } from './reports/reports.module';
import { SettingsModule } from './settings/settings.module';
import { SystemSetting } from './settings/system-setting.entity';
import { Transaction } from './transactions/transaction.entity';
import { TransactionsModule } from './transactions/transactions.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { WalletAddress } from './wallet-addresses/wallet-address.entity';
import { WalletAddressesModule } from './wallet-addresses/wallet-addresses.module';
import { Withdrawal } from './withdrawals/withdrawal.entity';
import { WithdrawalsModule } from './withdrawals/withdrawals.module';
import { ReferralsModule } from './referrals/referrals.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditLog } from './audit-logs/audit-log.entity';
import { UploadsModule } from './uploads/uploads.module';
import { MailModule } from './mail/mail.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AdminsModule } from './admins/admins.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, AuthSession, PasswordResetToken, Investment, Transaction, Deposit, Withdrawal, Profit, ReferralCommission, WalletAddress, Notification, SystemSetting, AuditLog],
      synchronize: false,
      migrations: ['dist/database/migrations/*.js'],
    }),
    AuthModule,
    UsersModule,
    SettingsModule,
    DepositsModule,
    InvestmentsModule,
    ProfitsModule,
    WithdrawalsModule,
    TransactionsModule,
    WalletAddressesModule,
    ReferralsModule,
    NotificationsModule,
    ReportsModule,
    AuditLogsModule,
    HealthModule,
    UploadsModule,
    MailModule,
    PermissionsModule,
    AdminsModule,
  ],
})
export class AppModule {}
