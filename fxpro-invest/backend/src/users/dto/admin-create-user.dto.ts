import { IsEmail, IsEnum, IsNumberString, IsOptional, IsString, MinLength } from 'class-validator';
import { UserStatus } from '../../common/enums/user-status.enum';

export class AdminCreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  fullName!: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsString()
  @MinLength(8)
  password!: string;

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
