import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '12', 10);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  /**
   * Trae el usuario por username INCLUYENDO la contraseña (select:false por
   * defecto) y su rol. Solo para el login.
   */
  findByUsernameWithPassword(username: string): Promise<User | null> {
    return this.users
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.username = :username', { username })
      .getOne();
  }

  findById(id: string): Promise<User | null> {
    return this.users.findOne({ where: { id }, relations: { role: true } });
  }

  /** Hashea la contraseña con bcrypt (12 rounds) antes de persistir. */
  async hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, SALT_ROUNDS);
  }
}
