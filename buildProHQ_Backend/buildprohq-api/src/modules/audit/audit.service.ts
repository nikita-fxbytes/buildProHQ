import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../infrastructure/persistence/typeorm/entities';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(params: {
    tableName: string;
    recordId?: string | null;
    actionType: 'CREATE' | 'UPDATE' | 'DELETE';
    oldValue?: unknown;
    newValue?: unknown;
    performedBy?: string | null;
    ipAddress?: string | null;
  }): Promise<void> {
    const row = this.auditLogRepository.create({
      tableName: params.tableName,
      recordId: params.recordId ?? null,
      actionType: params.actionType,
      oldValue: (params.oldValue as Record<string, unknown> | null) ?? null,
      newValue: (params.newValue as Record<string, unknown> | null) ?? null,
      performedBy: params.performedBy ?? null,
      ipAddress: params.ipAddress ?? null,
    });
    await this.auditLogRepository.save(row);
  }
}
