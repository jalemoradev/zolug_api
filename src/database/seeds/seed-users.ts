import 'reflect-metadata';
import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import AppDataSource from '../../config/data-source';
import { User } from '../../modules/users/entities/user.entity';
import { TypeUserRole } from '../../modules/users/entities/type-user-role.entity';

/**
 * Seeder de usuarios de ZOLUG.
 *
 * Idempotente: identifica por `username`; si el usuario existe, actualiza sus
 * datos y re-hashea la contraseña (deja el seed en un estado conocido); si no,
 * lo crea. Reutiliza el MISMO DataSource que el runtime y las migraciones
 * (config/data-source.ts) para no divergir de configuración.
 *
 * Uso: `yarn seed:users`
 */

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '12', 10);

/** Contraseña compartida de los usuarios de desarrollo sembrados. */
const SEED_PASSWORD = 'Zolug2026!';

/** Definición declarativa de cada usuario a sembrar. El rol se resuelve por `code`. */
interface SeedUser {
  username: string;
  fullName: string;
  email: string;
  roleCode: string;
}

const SEED_USERS: readonly SeedUser[] = [
  {
    username: 'coordinador',
    fullName: 'Coordinador ZOLUG',
    email: 'coordinador@zolug.local',
    roleCode: 'COORDINATOR',
  },
  {
    username: 'asesor',
    fullName: 'Asesor ZOLUG',
    email: 'asesor@zolug.local',
    roleCode: 'ADVISOR',
  },
];

type SeedOutcome = 'created' | 'updated';

/** Crea o actualiza un usuario. Devuelve si fue alta o actualización. */
async function upsertUser(
  dataSource: DataSource,
  def: SeedUser,
  passwordHash: string,
): Promise<SeedOutcome> {
  const roles = dataSource.getRepository(TypeUserRole);
  const users = dataSource.getRepository(User);

  const role = await roles.findOne({ where: { code: def.roleCode } });
  if (!role) {
    throw new Error(
      `Rol '${def.roleCode}' no existe en types_user_roles. Siembra los roles antes que los usuarios.`,
    );
  }

  const existing = await users.findOne({ where: { username: def.username } });

  if (existing) {
    await users.update(existing.id, {
      fullName: def.fullName,
      email: def.email,
      userRoleId: role.id,
      password: passwordHash,
      active: true,
      mustChangePassword: false,
    });
    return 'updated';
  }

  await users.insert({
    username: def.username,
    fullName: def.fullName,
    email: def.email,
    userRoleId: role.id,
    password: passwordHash,
    active: true,
    mustChangePassword: false,
  });
  return 'created';
}

async function run(): Promise<void> {
  const dataSource = await AppDataSource.initialize();
  try {
    console.log(`Sembrando ${SEED_USERS.length} usuario(s)...`);

    for (const def of SEED_USERS) {
      const passwordHash = await bcrypt.hash(SEED_PASSWORD, SALT_ROUNDS);
      const outcome = await upsertUser(dataSource, def, passwordHash);
      const verb = outcome === 'created' ? 'creado' : 'actualizado';
      console.log(`  ✓ ${def.username.padEnd(12)} (${def.roleCode}) ${verb}`);
    }

    console.log(`\nListo. Contraseña de todos los usuarios sembrados: ${SEED_PASSWORD}`);
  } finally {
    await dataSource.destroy();
  }
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\nError al sembrar usuarios: ${message}`);
  process.exit(1);
});
