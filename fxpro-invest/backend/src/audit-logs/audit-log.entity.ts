import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'text', nullable: true })
  actorUserId!: string | null;
  @Column()
  action!: string;
  @Column()
  entityType!: string;
  @Column({ type: 'text', nullable: true })
  entityId!: string | null;
  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, unknown>;
  @CreateDateColumn()
  createdAt!: Date;
}
