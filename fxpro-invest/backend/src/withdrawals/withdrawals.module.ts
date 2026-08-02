import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsModule } from '../settings/settings.module';
import { Transaction } from '../transactions/transaction.entity';
import { User } from '../users/user.entity';
import { Withdrawal } from './withdrawal.entity';
import { WithdrawalsController } from './withdrawals.controller';
import { WithdrawalsService } from './withdrawals.service';

@Module({
  imports: [TypeOrmModule.forFeature([Withdrawal, User, Transaction]), SettingsModule],
  controllers: [WithdrawalsController],
  providers: [WithdrawalsService],
})
export class WithdrawalsModule {}

