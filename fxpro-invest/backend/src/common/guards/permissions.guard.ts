import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/user-role.enum';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Permission } from '../../permissions/permission.enum';
import { rolePermissions } from '../../permissions/role-permissions';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required?.length) return true;
    const request = context.switchToHttp().getRequest<{ user?: { role?: UserRole } }>();
    const grants = request.user?.role ? rolePermissions[request.user.role] : [];
    if (grants[0] === '*') return true;
    const permissions = grants as Permission[];
    return required.every((permission) => permissions.includes(permission));
  }
}
