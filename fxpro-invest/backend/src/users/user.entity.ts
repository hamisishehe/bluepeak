import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from '../common/enums/user-role.enum';
import { UserStatus } from '../common/enums/user-status.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  @Exclude()
  passwordHash!: string;

  @Column()
  fullName!: string;

  @Column({ type: 'text', nullable: true })
  phoneNumber!: string | null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING_VERIFICATION })
  status!: UserStatus;

  @Column({ unique: true })
  referralCode!: string;

  @Column({ type: 'text', nullable: true })
  referredByUserId!: string | null;

  @Column({ default: false })
  emailVerified!: boolean;

  @Column({ default: false })
  phoneVerified!: boolean;

  @Column({ type: 'numeric', precision: 18, scale: 2, default: '0.00' })
  availableBalance!: string;

  @Column({ type: 'numeric', precision: 18, scale: 2, default: '0.00' })
  reservedBalance!: string;

  @Column({ type: 'numeric', precision: 18, scale: 2, default: '0.00' })
  investmentBalance!: string;

  @Column({ type: 'numeric', precision: 18, scale: 2, default: '0.00' })
  totalProfit!: string;

  @Column({ type: 'numeric', precision: 18, scale: 2, default: '0.00' })
  totalReferralEarnings!: string;

  @Column({ type: 'numeric', precision: 18, scale: 2, default: '0.00' })
  totalWithdrawn!: string;

  @Column({ type: 'timestamptz', nullable: true })
  lastLoginAt!: Date | null;

  @Column({ default: false })
  mustChangePassword!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
