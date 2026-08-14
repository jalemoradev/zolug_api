import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthenticatedUser } from '../types/authenticated-user.type';

/**
 * Guard de autorización por rol. Si el endpoint no declara @Roles(), solo exige
 * estar autenticado. Si declara, exige que el `roleCode` del usuario esté en la
 * lista permitida.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser | undefined;

    if (!user || !required.includes(user.roleCode)) {
      throw new ForbiddenException('No tiene permisos para esta acción.');
    }
    return true;
  }
}
