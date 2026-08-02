import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

@Injectable()
export class AuditLogsService {
  constructor(@InjectRepository(AuditLog) private readonly auditLogs: Repository<AuditLog>) {}
  create(entry: Omit<AuditLog, 'id' | 'createdAt'>, manager?: EntityManager) {
    const repo = manager?.getRepository(AuditLog) ?? this.auditLogs;
    return repo.save(repo.create(entry));
  }
  findAll() {
    return this.auditLogs.find({ order: { createdAt: 'DESC' }, take: 100 });
  }
}

