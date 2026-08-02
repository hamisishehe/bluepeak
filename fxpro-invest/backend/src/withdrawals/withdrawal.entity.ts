import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CryptoNetwork } from '../deposits/deposit.entity';

export enum WithdrawalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

@Entity('withdrawals')
export class Withdrawal {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column()
  userId!: string;
  @Column({ type: 'numeric', precision: 18, scale: 2 })
  amount!: string;
  @Column({ type: 'numeric', precision: 18, scale: 2, default: '0.00' })
  feeAmount!: string;
  @Column({ type: 'numeric', precision: 18, scale: 2 })
  netAmount!: string;
  @Column({ type: 'enum', enum: CryptoNetwork })
  network!: CryptoNetwork;
  @Column()
  walletAddress!: string;
  @Column({ type: 'enum', enum: WithdrawalStatus, default: WithdrawalStatus.PENDING })
  status!: WithdrawalStatus;
  @Column({ type: 'text', nullable: true })
  rejectionReason!: string | null;
  @Column({ type: 'text', nullable: true })
  reviewedByUserId!: string | null;
  @Column({ type: 'timestamptz', nullable: true })
  paidAt!: Date | null;
  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updatedAt!: Date;
}
