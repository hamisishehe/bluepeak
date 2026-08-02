import { IsEnum, IsNumberString, IsString, MinLength } from 'class-validator';
import { CryptoNetwork } from '../../deposits/deposit.entity';

export class CreateWithdrawalDto {
  @IsNumberString()
  amount!: string;
  @IsEnum(CryptoNetwork)
  network!: CryptoNetwork;
  @IsString()
  @MinLength(12)
  walletAddress!: string;
}

