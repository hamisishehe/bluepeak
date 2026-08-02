import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';
import { User } from '../users/user.entity';
import { AuthSession } from './auth-session.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PasswordResetToken } from './password-reset-token.entity';

@Module({
  imports: [PassportModule, MailModule, TypeOrmModule.forFeature([User, AuthSession, PasswordResetToken]), JwtModule.register({ secret: process.env.JWT_ACCESS_SECRET ?? 'dev_secret', signOptions: { expiresIn: '15m' } })],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
