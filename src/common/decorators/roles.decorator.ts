import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Exige que el usuario tenga uno de estos roles (por `code` del catálogo
 * types_user_roles: SUPER, ADMINISTRATOR, COORDINATOR, ADVISOR, LAWYER…).
 * Sin este decorador, un endpoint protegido solo exige estar autenticado.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
