import { UserRole } from '../common/enums/user-role.enum';
import { Permission } from './permission.enum';

export const rolePermissions: Record<UserRole, Permission[] | ['*']> = {
  [UserRole.USER]: [
    Permission.USER_DASHBOARD_VIEW,
    Permission.PROFILE_MANAGE,
    Permission.DEPOSIT_CREATE,
    Permission.DEPOSIT_VIEW_OWN,
    Permission.INVESTMENT_VIEW_OWN,
    Permission.PROFIT_VIEW_OWN,
    Permission.WITHDRAWAL_CREATE,
    Permission.WITHDRAWAL_VIEW_OWN,
    Permission.REFERRAL_VIEW_OWN,
    Permission.TRANSACTION_VIEW_OWN,
  ],
  [UserRole.ADMIN]: [
    Permission.USER_VIEW,
    Permission.DEPOSIT_VIEW_ALL,
    Permission.DEPOSIT_APPROVE,
    Permission.DEPOSIT_REJECT,
    Permission.INVESTMENT_VIEW_ALL,
    Permission.PROFIT_VIEW_ALL,
    Permission.WITHDRAWAL_VIEW_ALL,
    Permission.WITHDRAWAL_APPROVE,
    Permission.WITHDRAWAL_PROCESS,
    Permission.WITHDRAWAL_PAY,
    Permission.WITHDRAWAL_REJECT,
    Permission.REFERRAL_VIEW_ALL,
    Permission.TRANSACTION_VIEW_ALL,
  ],
  [UserRole.SUPER_ADMIN]: ['*'],
};

