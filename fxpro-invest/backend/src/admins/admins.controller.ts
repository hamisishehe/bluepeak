import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Repository } from 'typeorm';
import { UserRole } from '../common/enums/user-role.enum';
import { UserStatus } from '../common/enums/user-status.enum';
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permission } from '../permissions/permission.enum';
import { User } from '../users/user.entity';

class CreateAdminDto {
  @IsString()
  @MinLength(2)
  fullName!: string;
  @IsEmail()
  email!: string;
  @IsString()
  @MinLength(8)
  password!: string;
  @IsEnum(UserRole)
  role!: UserRole.ADMIN | UserRole.SUPER_ADMIN;
}

class UpdateAdminDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string;
  @IsOptional()
  @IsEmail()
  email?: string;
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole.ADMIN | UserRole.SUPER_ADMIN;
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}

class ResetAdminPasswordDto {
  @IsString()
  @MinLength(8)
  newPassword!: string;
}

@Controller('api/v1/admin/administrators')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminsController {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}
  @Get()
  @Permissions(Permission.ADMIN_MANAGE)
  findAdmins() {
    return this.users.find({ where: [{ role: UserRole.ADMIN }, { role: UserRole.SUPER_ADMIN }], order: { createdAt: 'DESC' } });
  }
  @Post()
  @Permissions(Permission.ADMIN_MANAGE)
  async create(@Body() dto: CreateAdminDto) {
    const email = dto.email.trim().toLowerCase();
    if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(dto.role)) throw new BadRequestException('Role must be ADMIN or SUPER_ADMIN');
    if (await this.users.exists({ where: { email } })) throw new BadRequestException('Email is already registered');
    return this.users.save(this.users.create({
      fullName: dto.fullName,
      email,
      passwordHash: await bcrypt.hash(dto.password, 12),
      role: dto.role,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      mustChangePassword: true,
      referralCode: `FXADMIN${Date.now().toString(36).toUpperCase()}`,
    }));
  }

  @Patch(':id')
  @Permissions(Permission.ADMIN_MANAGE)
  async update(@Param('id') id: string, @Body() dto: UpdateAdminDto) {
    const admin = await this.findAdmin(id);
    if (dto.email !== undefined) {
      const email = dto.email.trim().toLowerCase();
      const owner = await this.users.findOneBy({ email });
      if (owner && owner.id !== admin.id) throw new BadRequestException('Email is already registered');
      admin.email = email;
    }
    if (dto.fullName !== undefined) admin.fullName = dto.fullName;
    if (dto.role !== undefined) {
      if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(dto.role)) throw new BadRequestException('Role must be ADMIN or SUPER_ADMIN');
      admin.role = dto.role;
    }
    if (dto.status !== undefined) admin.status = dto.status;
    return this.users.save(admin);
  }

  @Patch(':id/reset-password')
  @Permissions(Permission.ADMIN_MANAGE)
  async resetPassword(@Param('id') id: string, @Body() dto: ResetAdminPasswordDto) {
    const admin = await this.findAdmin(id);
    admin.passwordHash = await bcrypt.hash(dto.newPassword, 12);
    admin.mustChangePassword = true;
    await this.users.save(admin);
    return { message: 'Administrator password reset successfully' };
  }

  private async findAdmin(id: string) {
    const admin = await this.users.findOneBy({ id });
    if (!admin || ![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(admin.role)) throw new NotFoundException('Administrator not found');
    return admin;
  }
}
