import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    console.log('User Roles:', user.roles); // 로그 추가
    console.log('Required Roles:', requiredRoles); // 로그 추가

    const userRoles = Array.isArray(user.roles) ? user.roles : [user.roles];

    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
