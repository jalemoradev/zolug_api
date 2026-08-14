import { readFileSync } from 'node:fs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import {
  AuthenticatedUser,
  JwtPayload,
} from '../../common/types/authenticated-user.type';

@Injectable()
export class AuthService {
  private readonly privateKey = readFileSync(
    process.env.JWT_PRIVATE_KEY_PATH ?? 'keys/jwt-private.pem',
  );

  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
  ) {}

  /**
   * Valida credenciales y devuelve el usuario público + un JWT RS256.
   * Mensaje genérico para no revelar si el usuario existe.
   */
  async login(
    username: string,
    password: string,
  ): Promise<{ user: AuthenticatedUser; token: string }> {
    const user = await this.usersService.findByUsernameWithPassword(username);
    const ok = user && (await bcrypt.compare(password, user.password));
    if (!user || !ok) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos.');
    }
    if (!user.active) {
      throw new UnauthorizedException('El usuario está inactivo.');
    }

    const authUser: AuthenticatedUser = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      roleId: user.userRoleId,
      roleCode: user.role?.code ?? '',
    };

    const payload: JwtPayload = {
      sub: authUser.id,
      username: authUser.username,
      fullName: authUser.fullName,
      email: authUser.email,
      roleId: authUser.roleId,
      roleCode: authUser.roleCode,
    };

    const token = this.jwt.sign(payload, {
      algorithm: 'RS256',
      privateKey: this.privateKey,
      // `as any`: jsonwebtoken tipa expiresIn como number|StringValue (template
      // literal de `ms`); un string de env no lo estrecha. Choque de tipos
      // conocido, no un bug — el valor '1d' es válido en runtime.
      expiresIn: (process.env.JWT_EXPIRES_IN ?? '1d') as any,
    });

    return { user: authUser, token };
  }
}
