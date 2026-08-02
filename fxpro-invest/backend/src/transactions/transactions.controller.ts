import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUser } from '../auth/current-user';
import { CurrentUserDecorator } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permission } from '../permissions/permission.enum';
import { Transaction } from './transaction.entity';

@ApiTags('transactions')
@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TransactionsController {
  constructor(@InjectRepository(Transaction) private readonly transactions: Repository<Transaction>) {}
  @Get('api/v1/transactions')
  @Permissions(Permission.TRANSACTION_VIEW_OWN)
  own(@CurrentUserDecorator() user: CurrentUser) {
    return this.transactions.find({ where: { userId: user.id }, order: { createdAt: 'DESC' }, take: 50 });
  }
  @Get('api/v1/admin/transactions')
  @Permissions(Permission.TRANSACTION_VIEW_ALL)
  all() {
    return this.transactions.find({ order: { createdAt: 'DESC' }, take: 100 });
  }
}

