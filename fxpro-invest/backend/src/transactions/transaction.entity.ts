import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TransactionType {
  DEPOSIT_APPROVED = 'DEPOSIT_APPROVED',
  INVESTMENT_CREATED = 'INVESTMENT_CREATED',
  PROFIT_CREDITED = 'PROFIT_CREDITED',
  WITHDRAWAL_RESERVED = 'WITHDRAWAL_RESERVED',
  WITHDRAWAL_PAID = 'WITHDRAWAL_PAID',
  WITHDRAWAL_REJECTED = 'WITHDRAWAL_REJECTED',
  REFERRAL_COMMISSION = 'REFERRAL_COMMISSION',
  REVERSAL = 'REVERSAL',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column()
  userId!: string;
  @Column({ type: 'enum', enum: TransactionType })
  type!: TransactionType;
  @Column({ type: 'numeric', precision: 18, scale: 2 })
  amount!: string;
  @Column({ default: 'POSTED' })
  status!: string;
  @Column({ type: 'text', nullable: true })
  referenceId!: string | null;
  @CreateDateColumn()
  createdAt!: Date;
}
