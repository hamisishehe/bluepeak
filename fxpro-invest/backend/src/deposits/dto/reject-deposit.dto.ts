import { IsString, MinLength } from 'class-validator';

export class RejectDepositDto {
  @IsString()
  @MinLength(5)
  reason!: string;
}

