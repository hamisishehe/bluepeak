import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

export enum InvestmentStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('investments')
@Unique(['depositId'])
export class Investment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column()
  userId!: string;
  @Column()
  depositId!: string;
  @Column({ type: 'numeric', precision: 18, scale: 2 })
  principalAmount!: string;
  @Column({ type: 'numeric', precision: 7, scale: 4 })
  weeklyReturnPercentage!: string;
  @Column({ type: 'numeric', precision: 18, scale: 2 })
  weeklyProfitAmount!: string;
  @Column({ type: 'numeric', precision: 18, scale: 2, default: '0.00' })
  totalProfitEarned!: string;
  @Column({ type: 'timestamptz' })
  startDate!: Date;
  @Column({ type: 'timestamptz' })
  nextProfitDate!: Date;
  @Column({ type: 'timestamptz', nullable: true })
  lastProfitDate!: Date | null;
  @Column({ type: 'enum', enum: InvestmentStatus, default: InvestmentStatus.ACTIVE })
  status!: InvestmentStatus;
  @Column({ type: 'text', nullable: true })
  statusReason!: string | null;
  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updatedAt!: Date;
}
