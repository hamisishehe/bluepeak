import { IsEnum, IsNumberString, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { CryptoNetwork } from '../deposit.entity';

export class CreateAdminDepositDto {
  @IsUUID()
  userId!: string;

  @IsNumberString()
  amount!: string;

  @IsEnum(CryptoNetwork)
  paymentNetwork!: CryptoNetwork;

  @IsString()
  @Length(6, 120)
  transactionReference!: string;

  @IsOptional()
  @IsString()
  paymentProofUrl?: string;
}
