import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CurrentUser } from '../auth/current-user';
import { money, moneyString } from '../common/utils/money';
import { SettingsService } from '../settings/settings.service';
import { Transaction, TransactionType } from '../transactions/transaction.entity';
import { User } from '../users/user.entity';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { Withdrawal, WithdrawalStatus } from './withdrawal.entity';

@Injectable()
export class WithdrawalsService {
  constructor(
    @InjectRepository(Withdrawal) private readonly withdrawals: Repository<Withdrawal>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly settingsService: SettingsService,
  ) {}

  async create(user: CurrentUser, dto: CreateWithdrawalDto) {
    const settings = await this.settingsService.getInvestmentSettings();
    const amount = money(dto.amount);
    if (!settings.withdrawalsEnabled) throw new BadRequestException('Withdrawals are disabled');
    if (amount.lt(settings.minimumWithdrawal) || amount.gt(settings.maximumWithdrawal)) throw new BadRequestException('Withdrawal amount is outside allowed limits');
    if (!settings.supportedWithdrawalNetworks.includes(dto.network)) throw new BadRequestException('Unsupported withdrawal network');
    return this.dataSource.transaction(async (manager) => {
      const account = await manager.getRepository(User).createQueryBuilder('user').setLock('pessimistic_write').where('user.id = :id', { id: user.id }).getOne();
      if (!account) throw new NotFoundException('User not found');
      if (money(account.availableBalance).lt(amount)) throw new BadRequestException('Insufficient available balance');
      account.availableBalance = moneyString(money(account.availableBalance).minus(amount));
      account.reservedBalance = moneyString(money(account.reservedBalance).plus(amount));
      await manager.save(account);
      const fee = amount.mul(settings.withdrawalFeePercentage).div(100).plus(settings.withdrawalFlatFee);
      const withdrawal = await manager.save(Withdrawal, manager.create(Withdrawal, { userId: user.id, amount: moneyString(amount), feeAmount: moneyString(fee), netAmount: moneyString(amount.minus(fee)), network: dto.network, walletAddress: dto.walletAddress }));
      await manager.save(Transaction, manager.create(Transaction, { userId: user.id, type: TransactionType.WITHDRAWAL_RESERVED, amount: moneyString(amount), referenceId: withdrawal.id }));
      return withdrawal;
    });
  }

  findOwn(user: CurrentUser) {
    return this.withdrawals.find({ where: { userId: user.id }, order: { createdAt: 'DESC' }, take: 50 });
  }

  findAll() {
    return this.withdrawals.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async transition(id: string, status: WithdrawalStatus, admin: CurrentUser, rejectionReason?: string) {
    return this.dataSource.transaction(async (manager) => {
      const withdrawal = await manager.getRepository(Withdrawal).createQueryBuilder('withdrawal').setLock('pessimistic_write').where('withdrawal.id = :id', { id }).getOne();
      if (!withdrawal) throw new NotFoundException('Withdrawal not found');
      withdrawal.status = status;
      withdrawal.reviewedByUserId = admin.id;
      withdrawal.rejectionReason = rejectionReason ?? null;
      if (status === WithdrawalStatus.PAID) withdrawal.paidAt = new Date();
      if (status === WithdrawalStatus.REJECTED) {
        const user = await manager.getRepository(User).createQueryBuilder('user').setLock('pessimistic_write').where('user.id = :id', { id: withdrawal.userId }).getOne();
        if (user) {
          user.availableBalance = moneyString(money(user.availableBalance).plus(withdrawal.amount));
          user.reservedBalance = moneyString(money(user.reservedBalance).minus(withdrawal.amount));
          await manager.save(user);
        }
      }
      if (status === WithdrawalStatus.PAID) {
        const user = await manager.getRepository(User).createQueryBuilder('user').setLock('pessimistic_write').where('user.id = :id', { id: withdrawal.userId }).getOne();
        if (user) {
          user.reservedBalance = moneyString(money(user.reservedBalance).minus(withdrawal.amount));
          user.totalWithdrawn = moneyString(money(user.totalWithdrawn).plus(withdrawal.amount));
          await manager.save(user);
        }
      }
      return manager.save(withdrawal);
    });
  }
}

