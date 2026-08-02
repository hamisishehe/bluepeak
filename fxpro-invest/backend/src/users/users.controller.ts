import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user';
import { CurrentUserDecorator } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { AdminResetPasswordDto } from './dto/admin-reset-password.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('api/v1/admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  create(@Body() dto: AdminCreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  update(@CurrentUserDecorator() admin: CurrentUser, @Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
    return this.usersService.updateUser(admin.id, id, dto);
  }

  @Patch(':id/block')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  block(@CurrentUserDecorator() admin: CurrentUser, @Param('id') id: string) {
    return this.usersService.blockUser(admin.id, id);
  }

  @Patch(':id/activate')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  activate(@CurrentUserDecorator() admin: CurrentUser, @Param('id') id: string) {
    return this.usersService.activateUser(admin.id, id);
  }

  @Patch(':id/reset-password')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  resetPassword(@CurrentUserDecorator() admin: CurrentUser, @Param('id') id: string, @Body() dto: AdminResetPasswordDto) {
    return this.usersService.resetUserPassword(admin.id, id, dto.newPassword);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  delete(@CurrentUserDecorator() admin: CurrentUser, @Param('id') id: string) {
    return this.usersService.deleteUser(admin.id, id);
  }
}

@ApiTags('users')
@ApiBearerAuth()
@Controller('api/v1/users')
@UseGuards(JwtAuthGuard)
export class UserSelfController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me/profile')
  findProfile(@CurrentUserDecorator() user: CurrentUser) {
    return this.usersService.findProfile(user.id);
  }

  @Patch('/me/profile')
  updateProfile(@CurrentUserDecorator() user: CurrentUser, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Post('/me/change-password')
  changePassword(@CurrentUserDecorator() user: CurrentUser, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(user.id, dto.currentPassword, dto.newPassword);
  }
}
