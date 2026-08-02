import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class AdminJwtAuthGuard extends JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    const request = context.switchToHttp().getRequest<{ user?: { role?: UserRole } }>();
    if (request.user?.role === UserRole.ADMIN || request.user?.role === UserRole.SUPER_ADMIN) return true;
    throw new ForbiddenException('Administrator access required');
  }
}

