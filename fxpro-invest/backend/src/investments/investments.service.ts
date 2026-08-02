import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUser } from '../auth/current-user';
import { Investment, InvestmentStatus } from './investment.entity';

@Injectable()
export class InvestmentsService {
  constructor(@InjectRepository(Investment) private readonly investments: Repository<Investment>) {}

  findOwn(user: CurrentUser) {
    return this.investments.find({ where: { userId: user.id }, order: { createdAt: 'DESC' }, take: 50 });
  }

  findAll() {
    return this.investments.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async updateStatus(id: string, status: InvestmentStatus, reason: string) {
    if (!reason || reason.length < 5) throw new BadRequestException('A reason is required');
    const investment = await this.investments.findOneBy({ id });
    if (!investment) throw new NotFoundException('Investment not found');
    investment.status = status;
    investment.statusReason = reason;
    return this.investments.save(investment);
  }
}

