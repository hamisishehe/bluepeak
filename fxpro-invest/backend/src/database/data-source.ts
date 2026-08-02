import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { AuditLog } from '../audit-logs/audit-log.entity';
import { Deposit } from '../deposits/deposit.entity';
import { AuthSession } from '../auth/auth-session.entity';
import { PasswordResetToken } from '../auth/password-reset-token.entity';
import { Investment } from '../investments/investment.entity';
import { Notification } from '../notifications/notification.entity';
import { Profit } from '../profits/profit.entity';
import { ReferralCommission } from '../referrals/referral-commission.entity';
import { SystemSetting } from '../settings/system-setting.entity';
import { Transaction } from '../transactions/transaction.entity';
import { User } from '../users/user.entity';
import { WalletAddress } from '../wallet-addresses/wallet-address.entity';
import { Withdrawal } from '../withdrawals/withdrawal.entity';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, AuthSession, PasswordResetToken, Investment, Transaction, Deposit, Withdrawal, Profit, ReferralCommission, WalletAddress, Notification, SystemSetting, AuditLog],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
