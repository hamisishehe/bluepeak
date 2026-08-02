import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { CurrentUserDecorator } from '../common/decorators/current-user.decorator';
import { AdminJwtAuthGuard } from '../common/guards/admin-jwt-auth.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from './current-user';
import { AuthService } from './auth.service';
import { Request } from 'express';

class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

class RegisterDto extends LoginDto {
  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsOptional()
  @IsString()
  referralCode?: string;
}

class RefreshTokenDto {
  @IsString()
  refreshToken!: string;
}

class ForgotPasswordDto {
  @IsEmail()
  email!: string;
}

class ResetPasswordDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('api/v1/auth/login')
  login(@Body() dto: LoginDto, @Req() request: Request) {
    return this.authService.login(dto.email, dto.password, false, request.ip, request.headers['user-agent']);
  }

  @Post('api/v1/admin/auth/login')
  adminLogin(@Body() dto: LoginDto, @Req() request: Request) {
    return this.authService.login(dto.email, dto.password, true, request.ip, request.headers['user-agent']);
  }

  @Post('api/v1/auth/register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('api/v1/auth/refresh-token')
  refresh(@Body() dto: RefreshTokenDto, @Req() request: Request) {
    return this.authService.refresh(dto.refreshToken, request.ip, request.headers['user-agent']);
  }

  @Post('api/v1/admin/auth/refresh-token')
  adminRefresh(@Body() dto: RefreshTokenDto, @Req() request: Request) {
    return this.authService.refresh(dto.refreshToken, request.ip, request.headers['user-agent']);
  }

  @Post('api/v1/auth/logout')
  logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @Post('api/v1/admin/auth/logout')
  adminLogout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @Post('api/v1/auth/forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('api/v1/admin/auth/forgot-password')
  adminForgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('api/v1/auth/reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.password);
  }

  @Post('api/v1/admin/auth/reset-password')
  adminResetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.password);
  }

  @Get('api/v1/auth/me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUserDecorator() user: CurrentUser) {
    return this.authService.me(user.id);
  }

  @Get('api/v1/admin/auth/me')
  @UseGuards(AdminJwtAuthGuard)
  adminMe(@CurrentUserDecorator() user: CurrentUser) {
    return this.authService.me(user.id);
  }
}
