import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AuditLog } from '../audit-logs/audit-log.entity';
import { CurrentUser } from '../auth/current-user';
import { money, moneyString } from '../common/utils/money';
import { Investment, InvestmentStatus } from '../investments/investment.entity';
import { Notification } from '../notifications/notification.entity';
import { ReferralCommission } from '../referrals/referral-commission.entity';
import { SettingsService } from '../settings/settings.service';
import { Transaction, TransactionType } from '../transactions/transaction.entity';
import { User } from '../users/user.entity';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { CreateAdminDepositDto } from './dto/create-admin-deposit.dto';
import { Deposit, DepositStatus } from './deposit.entity';

@Injectable()
export class DepositsService {
  constructor(
    @InjectRepository(Deposit) private readonly deposits: Repository<Deposit>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly settingsService: SettingsService,
  ) {}

  async create(user: CurrentUser, dto: CreateDepositDto) {
    const settings = await this.settingsService.getInvestmentSettings();
    const amount = money(dto.amount);
    if (!settings.depositsEnabled) throw new BadRequestException('Deposits are disabled');
    if (amount.lt(settings.minimumDeposit) || amount.gt(settings.maximumDeposit)) throw new BadRequestException('Deposit amount is outside allowed limits');
    if (!settings.supportedDepositNetworks.includes(dto.paymentNetwork)) throw new BadRequestException('Unsupported payment network');
    return this.deposits.save(this.deposits.create({ userId: user.id, amount: moneyString(amount), paymentNetwork: dto.paymentNetwork, transactionReference: dto.transactionReference, paymentProofUrl: dto.paymentProofUrl ?? null }));
  }

  async createForUser(admin: CurrentUser, dto: CreateAdminDepositDto) {
    const settings = await this.settingsService.getInvestmentSettings();
    const amount = money(dto.amount);
    if (amount.lt(settings.minimumDeposit) || amount.gt(settings.maximumDeposit)) throw new BadRequestException('Deposit amount is outside allowed limits');
    if (!settings.supportedDepositNetworks.includes(dto.paymentNetwork)) throw new BadRequestException('Unsupported payment network');
    const user = await this.dataSource.getRepository(User).findOneBy({ id: dto.userId });
    if (!user) throw new NotFoundException('User not found');
    const deposit = await this.deposits.save(this.deposits.create({
      userId: user.id,
      amount: moneyString(amount),
      paymentNetwork: dto.paymentNetwork,
      transactionReference: dto.transactionReference,
      paymentProofUrl: dto.paymentProofUrl ?? null,
      status: DepositStatus.PENDING,
    }));
    await this.dataSource.getRepository(AuditLog).save(this.dataSource.getRepository(AuditLog).create({
      actorUserId: admin.id,
      action: 'deposit.create_for_user',
      entityType: 'Deposit',
      entityId: deposit.id,
      metadata: { userId: user.id, amount: deposit.amount, paymentNetwork: deposit.paymentNetwork },
    }));
    return deposit;
  }

  findOwn(user: CurrentUser) {
    return this.deposits.find({ where: { userId: user.id }, order: { createdAt: 'DESC' }, take: 50 });
  }

  findAll() {
    return this.deposits.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async approve(id: string, admin: CurrentUser) {
    const settings = await this.settingsService.getInvestmentSettings();
    return this.dataSource.transaction(async (manager) => {
      const deposit = await manager.getRepository(Deposit).createQueryBuilder('deposit').setLock('pessimistic_write').where('deposit.id = :id', { id }).getOne();
      if (!deposit) throw new NotFoundException('Deposit not found');
      if (deposit.status !== DepositStatus.PENDING) throw new BadRequestException('Deposit is not pending');
      const amount = money(deposit.amount);
      if (amount.lt(settings.minimumDeposit) || amount.gt(settings.maximumDeposit)) throw new BadRequestException('Deposit violates current limits');

      deposit.status = DepositStatus.APPROVED;
      deposit.reviewedByUserId = admin.id;
      deposit.approvedAt = new Date();
      await manager.save(deposit);

      const weeklyProfit = amount.mul(settings.weeklyReturnPercentage).div(100);
      const startDate = new Date();
      const nextProfitDate = new Date(startDate);
      nextProfitDate.setUTCMinutes(nextProfitDate.getUTCMinutes() + settings.profitIntervalMinutes);
      const investment = await manager.save(Investment, manager.create(Investment, {
        userId: deposit.userId,
        depositId: deposit.id,
        principalAmount: moneyString(amount),
        weeklyReturnPercentage: settings.weeklyReturnPercentage,
        weeklyProfitAmount: moneyString(weeklyProfit),
        startDate,
        nextProfitDate,
        lastProfitDate: null,
        status: InvestmentStatus.ACTIVE,
      }));

      const user = await manager.getRepository(User).createQueryBuilder('user').setLock('pessimistic_write').where('user.id = :id', { id: deposit.userId }).getOne();
      if (user) {
        user.investmentBalance = moneyString(money(user.investmentBalance).plus(amount));
        await manager.save(user);
        if (user.referredByUserId && settings.referralsEnabled) {
          const commission = amount.mul(settings.referralCommissionPercentage).div(100);
          await manager.save(ReferralCommission, manager.create(ReferralCommission, { referrerUserId: user.referredByUserId, referredUserId: user.id, depositId: deposit.id, amount: moneyString(commission) }));
        }
      }

      await manager.save(Transaction, manager.create(Transaction, { userId: deposit.userId, type: TransactionType.INVESTMENT_CREATED, amount: moneyString(amount), referenceId: investment.id }));
      await manager.save(Notification, manager.create(Notification, { userId: deposit.userId, title: 'Deposit approved', body: `Your USD ${deposit.amount} deposit is now active.` }));
      await manager.save(AuditLog, manager.create(AuditLog, { actorUserId: admin.id, action: 'deposit.approve', entityType: 'Deposit', entityId: deposit.id, metadata: { investmentId: investment.id } }));
      return { deposit, investment };
    });
  }

  async reject(id: string, reason: string, admin: CurrentUser) {
    const deposit = await this.deposits.findOneBy({ id });
    if (!deposit) throw new NotFoundException('Deposit not found');
    if (deposit.status !== DepositStatus.PENDING) throw new BadRequestException('Deposit is not pending');
    deposit.status = DepositStatus.REJECTED;
    deposit.rejectionReason = reason;
    deposit.reviewedByUserId = admin.id;
    deposit.rejectedAt = new Date();
    return this.deposits.save(deposit);
  }
}
