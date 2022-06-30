import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { matchRoles } from './roles';

export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    this.reflector = new Reflector();
  }

  canActivate(context: ExecutionContext): boolean {
    const roles =
      this.reflector.get<string[]>('roles', context.getHandler()) || [];

    if (!roles) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return matchRoles(roles, user.role);
  }
}
