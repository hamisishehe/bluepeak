import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { IsNull, Repository } from 'typeorm';
import { UserRole } from '../common/enums/user-role.enum';
import { UserStatus } from '../common/enums/user-status.enum';
import { rolePermissions } from '../permissions/role-permissions';
import { User } from '../users/user.entity';
import { AuthSession } from './auth-session.entity';
import { PasswordResetToken } from './password-reset-token.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(AuthSession) private readonly sessions: Repository<AuthSession>,
    @InjectRepository(PasswordResetToken) private readonly resetTokens: Repository<PasswordResetToken>,
    private readonly mailService: MailService,
  ) {}

  async login(email: string, password: string, adminPortal: boolean, ipAddress?: string, userAgent?: string) {
    const user = await this.users.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    if (user.status === UserStatus.SUSPENDED || user.status === UserStatus.BLOCKED) throw new ForbiddenException('Account is not allowed to sign in');
    if (adminPortal && user.role === UserRole.USER) throw new ForbiddenException('Use an administrator account');
    if (!adminPortal && user.role !== UserRole.USER) throw new ForbiddenException('Redirect to /admin');
    user.lastLoginAt = new Date();
    await this.users.save(user);
    const refreshToken = this.createOpaqueToken();
    const expiresAt = new Date();
    expiresAt.setUTCDate(expiresAt.getUTCDate() + 7);
    await this.sessions.save(this.sessions.create({
      userId: user.id,
      refreshTokenHash: await bcrypt.hash(refreshToken, 12),
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
      expiresAt,
      revokedAt: null,
    }));
    return {
      accessToken: this.jwtService.sign({ sub: user.id, email: user.email, role: user.role }),
      refreshToken,
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role, permissions: rolePermissions[user.role] },
    };
  }

  async register(dto: { email: string; password: string; fullName: string; referralCode?: string }) {
    const existing = await this.users.exists({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email is already registered');
    const referrer = dto.referralCode ? await this.users.findOne({ where: { referralCode: dto.referralCode } }) : null;
    const user = await this.users.save(this.users.create({
      email: dto.email,
      fullName: dto.fullName,
      passwordHash: await bcrypt.hash(dto.password, 12),
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      referralCode: `FX${Date.now().toString(36).toUpperCase()}`,
      referredByUserId: referrer?.id ?? null,
    }));
    return this.login(user.email, dto.password, false);
  }

  async me(userId: string) {
    const user = await this.users.findOne({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        status: true,
        referralCode: true,
        emailVerified: true,
        phoneVerified: true,
        availableBalance: true,
        reservedBalance: true,
        investmentBalance: true,
        totalProfit: true,
        totalReferralEarnings: true,
        totalWithdrawn: true,
        lastLoginAt: true,
        mustChangePassword: true,
        createdAt: true,
      },
    });
    if (!user) throw new UnauthorizedException('Invalid session');
    return { ...user, permissions: rolePermissions[user.role] };
  }

  async refresh(refreshToken: string, ipAddress?: string, userAgent?: string) {
    const session = await this.findValidSession(refreshToken);
    const user = await this.users.findOneBy({ id: session.userId });
    if (!user) throw new UnauthorizedException('Invalid session');
    session.revokedAt = new Date();
    await this.sessions.save(session);
    const nextRefreshToken = this.createOpaqueToken();
    const expiresAt = new Date();
    expiresAt.setUTCDate(expiresAt.getUTCDate() + 7);
    await this.sessions.save(this.sessions.create({
      userId: user.id,
      refreshTokenHash: await bcrypt.hash(nextRefreshToken, 12),
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
      expiresAt,
      revokedAt: null,
    }));
    return {
      accessToken: this.jwtService.sign({ sub: user.id, email: user.email, role: user.role }),
      refreshToken: nextRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    const session = await this.findValidSession(refreshToken);
    session.revokedAt = new Date();
    await this.sessions.save(session);
    return { message: 'Logged out' };
  }

  async forgotPassword(email: string) {
    const user = await this.users.findOneBy({ email });
    if (!user) return { message: 'Password reset instructions queued' };
    const token = this.createOpaqueToken();
    const expiresAt = new Date();
    expiresAt.setUTCHours(expiresAt.getUTCHours() + 1);
    await this.resetTokens.save(this.resetTokens.create({ userId: user.id, tokenHash: await bcrypt.hash(token, 12), expiresAt, usedAt: null }));
    await this.mailService.sendPasswordReset(user.email, token);
    return { message: 'Password reset instructions queued' };
  }

  async resetPassword(token: string, password: string) {
    const resets = await this.resetTokens.find({ where: { usedAt: IsNull() } });
    const reset = await this.findByToken(resets, token);
    if (!reset || reset.expiresAt < new Date()) throw new BadRequestException('Invalid or expired reset token');
    const user = await this.users.findOneBy({ id: reset.userId });
    if (!user) throw new BadRequestException('Invalid reset token');
    user.passwordHash = await bcrypt.hash(password, 12);
    user.mustChangePassword = false;
    reset.usedAt = new Date();
    await this.users.save(user);
    await this.resetTokens.save(reset);
    await this.sessions.update({ userId: user.id, revokedAt: IsNull() }, { revokedAt: new Date() });
    return { message: 'Password reset completed' };
  }

  private createOpaqueToken(): string {
    return randomBytes(48).toString('base64url');
  }

  private async findValidSession(refreshToken: string): Promise<AuthSession> {
    const sessions = await this.sessions.find({ where: { revokedAt: IsNull() } });
    const session = await this.findByToken(sessions, refreshToken);
    if (!session || session.expiresAt < new Date()) throw new UnauthorizedException('Invalid session');
    return session;
  }

  private async findByToken<T extends { refreshTokenHash?: string; tokenHash?: string }>(rows: T[], token: string): Promise<T | null> {
    for (const row of rows) {
      const hash = row.refreshTokenHash ?? row.tokenHash;
      if (hash && await bcrypt.compare(token, hash)) return row;
    }
    return null;
  }
}
