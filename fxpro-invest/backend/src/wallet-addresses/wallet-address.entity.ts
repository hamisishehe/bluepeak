import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CryptoNetwork } from '../deposits/deposit.entity';

@Entity('wallet_addresses')
export class WalletAddress {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column()
  userId!: string;
  @Column({ type: 'enum', enum: CryptoNetwork })
  network!: CryptoNetwork;
  @Column()
  address!: string;
  @Column({ default: true })
  active!: boolean;
  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updatedAt!: Date;
}

