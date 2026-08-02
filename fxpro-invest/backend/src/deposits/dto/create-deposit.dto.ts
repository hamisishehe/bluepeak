import { IsEnum, IsNumberString, IsOptional, IsString, Length } from 'class-validator';
import { CryptoNetwork } from '../deposit.entity';

export class CreateDepositDto {
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

