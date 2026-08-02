import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
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
    return this.users.save(this.users.create({
      fullName: dto.fullName,
      email: dto.email,
      passwordHash: await bcrypt.hash(dto.password, 12),
      role: dto.role,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      mustChangePassword: true,
      referralCode: `FXADMIN${Date.now().toString(36).toUpperCase()}`,
    }));
  }
}

