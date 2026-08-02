import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserRole } from '../common/enums/user-role.enum';
import { UserStatus } from '../common/enums/user-status.enum';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  findAll() {
    return this.users.find({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        availableBalance: true,
        investmentBalance: true,
        totalProfit: true,
        createdAt: true,
      },
    });
  }

  async findProfile(userId: string) {
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
        createdAt: true,
      },
    });
    if (!user) throw new UnauthorizedException('Invalid session');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.users.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException('Invalid session');
    if (dto.fullName !== undefined) user.fullName = dto.fullName;
    if (dto.phoneNumber !== undefined) user.phoneNumber = dto.phoneNumber || null;
    await this.users.save(user);
    return this.findProfile(userId);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.users.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException('Invalid session');
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new BadRequestException('Current password is incorrect');
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.mustChangePassword = false;
    await this.users.save(user);
    return { message: 'Password changed successfully' };
  }

  async blockUser(adminId: string, userId: string) {
    const user = await this.findAdminTarget(adminId, userId);
    if (user.role !== UserRole.USER) throw new ForbiddenException('Administrator accounts cannot be blocked here');
    user.status = UserStatus.BLOCKED;
    await this.users.save(user);
    return this.findProfile(user.id);
  }

  async activateUser(adminId: string, userId: string) {
    const user = await this.findAdminTarget(adminId, userId);
    if (user.role !== UserRole.USER) throw new ForbiddenException('Administrator accounts cannot be activated here');
    user.status = UserStatus.ACTIVE;
    await this.users.save(user);
    return this.findProfile(user.id);
  }

  async resetUserPassword(adminId: string, userId: string, newPassword: string) {
    const user = await this.findAdminTarget(adminId, userId);
    if (user.role !== UserRole.USER) throw new ForbiddenException('Administrator passwords cannot be reset here');
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.mustChangePassword = true;
    await this.users.save(user);
    return { message: 'User password reset successfully' };
  }

  async deleteUser(adminId: string, userId: string) {
    const user = await this.findAdminTarget(adminId, userId);
    if (user.role !== UserRole.USER) throw new ForbiddenException('Administrator accounts cannot be deleted here');
    await this.users.delete({ id: user.id });
    return { message: 'User account deleted' };
  }

  private async findAdminTarget(adminId: string, userId: string) {
    if (adminId === userId) throw new BadRequestException('You cannot perform this action on your own account');
    const user = await this.users.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
