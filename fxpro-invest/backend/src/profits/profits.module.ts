import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Investment } from '../investments/investment.entity';
import { Notification } from '../notifications/notification.entity';
import { SettingsModule } from '../settings/settings.module';
import { Transaction } from '../transactions/transaction.entity';
import { User } from '../users/user.entity';
import { Profit } from './profit.entity';
import { ProfitsController } from './profits.controller';
import { ProfitsService } from './profits.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profit, Investment, User, Transaction, Notification]), SettingsModule],
  controllers: [ProfitsController],
  providers: [ProfitsService],
})
export class ProfitsModule {}

