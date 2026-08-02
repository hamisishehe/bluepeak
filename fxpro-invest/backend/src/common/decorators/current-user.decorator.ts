import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUser } from '../../auth/current-user';

export const CurrentUserDecorator = createParamDecorator((_: unknown, context: ExecutionContext): CurrentUser => {
  const request = context.switchToHttp().getRequest<{ user: CurrentUser }>();
  return request.user;
});

