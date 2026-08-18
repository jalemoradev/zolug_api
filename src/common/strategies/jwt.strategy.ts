import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import {
  AuthenticatedUser,
  JwtPayload,
} from '../types/authenticated-user.type';
import { getJwtPublicKey } from '../config/jwt-keys';

/**
 * Estrategia JWT RS256. Extrae el token de la cookie `zolug-auth` primero, con
 * Bearer como respaldo (mismo orden que NODO). Verifica con la clave pública.
 *
 * `validate` NO consulta la BD: reconstruye el usuario desde el payload ya
 * verificado. El rol viene del token, nunca del cliente.
 */
function cookieExtractor(req: Request): string | null {
  const name = process.env.AUTH_COOKIE_NAME ?? 'zolug-auth';
  if (req?.cookies && typeof req.cookies[name] === 'string') {
    return req.cookies[name];
  }
  return null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: getJwtPublicKey(),
      algorithms: ['RS256'],
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    return {
      id: payload.sub,
      username: payload.username,
      fullName: payload.fullName,
      email: payload.email,
      roleId: payload.roleId,
      roleCode: payload.roleCode,
    };
  }
}
