import { IsEmail, IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { UserStatus } from '../../common/enums/user-status.enum';

export class AdminUpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsNumberString()
  availableBalance?: string;

  @IsOptional()
  @IsNumberString()
  investmentBalance?: string;
}
