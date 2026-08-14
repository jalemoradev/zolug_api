/**
 * El usuario tal como viaja en el JWT y queda en `request.user` tras el guard.
 * NO incluye la contraseña ni datos sensibles: solo lo mínimo para autorizar.
 */
export interface AuthenticatedUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  roleId: string;
  /** `code` del rol en types_user_roles. Es lo que compara el RolesGuard. */
  roleCode: string;
}

/** El payload que se firma en el JWT. */
export interface JwtPayload {
  sub: string;
  username: string;
  fullName: string;
  email: string;
  roleId: string;
  roleCode: string;
}
