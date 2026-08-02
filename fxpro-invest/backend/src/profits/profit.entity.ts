import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

export enum ProfitStatus {
  PENDING = 'PENDING',
  CREDITED = 'CREDITED',
  FAILED = 'FAILED',
  REVERSED = 'REVERSED',
}

@Entity('profits')
@Unique(['investmentId', 'scheduledDate'])
export class Profit {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column()
  userId!: string;
  @Column()
  investmentId!: string;
  @Column({ type: 'numeric', precision: 18, scale: 2 })
  principalAmount!: string;
  @Column({ type: 'numeric', precision: 7, scale: 4 })
  profitPercentage!: string;
  @Column({ type: 'numeric', precision: 18, scale: 2 })
  profitAmount!: string;
  @Column({ type: 'timestamptz' })
  scheduledDate!: Date;
  @Column({ type: 'timestamptz', nullable: true })
  creditedAt!: Date | null;
  @Column({ type: 'enum', enum: ProfitStatus, default: ProfitStatus.PENDING })
  status!: ProfitStatus;
  @Column({ type: 'text', nullable: true })
  failureReason!: string | null;
  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updatedAt!: Date;
}
