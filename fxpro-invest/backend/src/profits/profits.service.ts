import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository, DataSource } from 'typeorm';
import { CurrentUser } from '../auth/current-user';
import { money, moneyString } from '../common/utils/money';
import { Investment, InvestmentStatus } from '../investments/investment.entity';
import { Notification } from '../notifications/notification.entity';
import { SettingsService } from '../settings/settings.service';
import { Transaction, TransactionType } from '../transactions/transaction.entity';
import { User } from '../users/user.entity';
import { Profit, ProfitStatus } from './profit.entity';

@Injectable()
export class ProfitsService {
  constructor(
    @InjectRepository(Profit) private readonly profits: Repository<Profit>,
    @InjectRepository(Investment) private readonly investments: Repository<Investment>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly settingsService: SettingsService,
  ) {}

  findOwn(user: CurrentUser) {
    return this.profits.find({ where: { userId: user.id }, order: { scheduledDate: 'DESC' }, take: 50 });
  }

  findAll() {
    return this.profits.find({ order: { scheduledDate: 'DESC' }, take: 100 });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async processDueProfits() {
    const due = await this.investments.find({ where: { status: InvestmentStatus.ACTIVE, nextProfitDate: LessThanOrEqual(new Date()) }, take: 100 });
    for (const investment of due) await this.creditInvestmentProfit(investment.id);
  }

  async creditInvestmentProfit(investmentId: string) {
    const settings = await this.settingsService.getInvestmentSettings();
    return this.dataSource.transaction(async (manager) => {
      const investment = await manager.getRepository(Investment).createQueryBuilder('investment').setLock('pessimistic_write').where('investment.id = :id', { id: investmentId }).getOne();
      if (!investment || investment.status !== InvestmentStatus.ACTIVE || investment.nextProfitDate > new Date()) return null;
      const scheduledDate = investment.nextProfitDate;
      const profitAmount = money(investment.principalAmount).mul(investment.weeklyReturnPercentage).div(100);
      const profit = await manager.save(Profit, manager.create(Profit, { userId: investment.userId, investmentId: investment.id, principalAmount: investment.principalAmount, profitPercentage: investment.weeklyReturnPercentage, profitAmount: moneyString(profitAmount), scheduledDate, creditedAt: new Date(), status: ProfitStatus.CREDITED }));
      const user = await manager.getRepository(User).createQueryBuilder('user').setLock('pessimistic_write').where('user.id = :id', { id: investment.userId }).getOne();
      if (user) {
        user.availableBalance = moneyString(money(user.availableBalance).plus(profitAmount));
        user.totalProfit = moneyString(money(user.totalProfit).plus(profitAmount));
        await manager.save(user);
      }
      investment.totalProfitEarned = moneyString(money(investment.totalProfitEarned).plus(profitAmount));
      investment.lastProfitDate = scheduledDate;
      investment.nextProfitDate = new Date(scheduledDate);
      investment.nextProfitDate.setUTCMinutes(investment.nextProfitDate.getUTCMinutes() + settings.profitIntervalMinutes);
      await manager.save(investment);
      await manager.save(Transaction, manager.create(Transaction, { userId: investment.userId, type: TransactionType.PROFIT_CREDITED, amount: moneyString(profitAmount), referenceId: profit.id }));
      await manager.save(Notification, manager.create(Notification, { userId: investment.userId, title: 'Investment return credited', body: `USD ${moneyString(profitAmount)} has been credited to your account.` }));
      return profit;
    });
  }
}
