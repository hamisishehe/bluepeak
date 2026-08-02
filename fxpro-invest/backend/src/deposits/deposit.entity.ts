import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum DepositStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum CryptoNetwork {
  BEP20 = 'BEP20',
  TRC20 = 'TRC20',
}

@Entity('deposits')
export class Deposit {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column()
  userId!: string;
  @Column({ type: 'numeric', precision: 18, scale: 2 })
  amount!: string;
  @Column({ default: 'USD' })
  currency!: string;
  @Column({ default: 'CRYPTO' })
  paymentMethod!: string;
  @Column({ type: 'enum', enum: CryptoNetwork })
  paymentNetwork!: CryptoNetwork;
  @Column()
  transactionReference!: string;
  @Column({ type: 'text', nullable: true })
  paymentProofUrl!: string | null;
  @Column({ type: 'enum', enum: DepositStatus, default: DepositStatus.PENDING })
  status!: DepositStatus;
  @Column({ type: 'text', nullable: true })
  rejectionReason!: string | null;
  @Column({ type: 'text', nullable: true })
  reviewedByUserId!: string | null;
  @Column({ type: 'timestamptz', nullable: true })
  approvedAt!: Date | null;
  @Column({ type: 'timestamptz', nullable: true })
  rejectedAt!: Date | null;
  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updatedAt!: Date;
}
