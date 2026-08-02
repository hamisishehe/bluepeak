import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { IsString } from 'class-validator';
import { Repository } from 'typeorm';
import { CurrentUser } from '../auth/current-user';
import { CurrentUserDecorator } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permission } from '../permissions/permission.enum';
import { Notification } from './notification.entity';

class SendNotificationDto {
  @IsString()
  userId!: string;
  @IsString()
  title!: string;
  @IsString()
  body!: string;
}

@ApiTags('notifications')
@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class NotificationsController {
  constructor(@InjectRepository(Notification) private readonly notifications: Repository<Notification>) {}
  @Get('api/v1/notifications')
  own(@CurrentUserDecorator() user: CurrentUser) {
    return this.notifications.find({ where: { userId: user.id }, order: { createdAt: 'DESC' }, take: 50 });
  }
  @Post('api/v1/admin/notifications')
  @Permissions(Permission.TRANSACTION_VIEW_ALL)
  send(@Body() dto: SendNotificationDto) {
    return this.notifications.save(this.notifications.create(dto));
  }
}

