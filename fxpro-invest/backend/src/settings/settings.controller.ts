import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permission } from '../permissions/permission.enum';
import { SettingsService } from './settings.service';

@ApiTags('settings')
@Controller('api/v1/admin/settings')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @Permissions(Permission.SETTINGS_MANAGE)
  getSettings() {
    return this.settingsService.getInvestmentSettings();
  }

  @Patch()
  @Permissions(Permission.SETTINGS_MANAGE)
  update(@Body() body: Record<string, string | number | boolean | string[]>) {
    return this.settingsService.updateSettings(body);
  }
}
