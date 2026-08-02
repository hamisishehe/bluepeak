import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('referral_commissions')
export class ReferralCommission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column()
  referrerUserId!: string;
  @Column()
  referredUserId!: string;
  @Column()
  depositId!: string;
  @Column({ type: 'numeric', precision: 18, scale: 2 })
  amount!: string;
  @Column({ default: false })
  reversed!: boolean;
  @CreateDateColumn()
  createdAt!: Date;
}

