import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DataSourceOptions } from 'typeorm';

/**
 * Fuente única de la configuración de TypeORM. Se comparte entre el runtime
 * (TypeOrmModule.forRootAsync en database.module.ts) y el CLI de migraciones
 * (data-source.ts), para que no diverjan — mismo patrón que NODO.
 *
 * `synchronize` va SIEMPRE en false: el esquema solo cambia por migraciones
 * generadas y revisadas. Nunca auto-sincronizar contra Neon.
 */
export function buildDataSourceOptions(): DataSourceOptions {
  const useSsl = process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production';

  return {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'zolug',
    entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
    migrations: [join(__dirname, '..', 'shared', 'database', 'migrations', '*.{ts,js}')],
    synchronize: false,
    logging: process.env.NODE_ENV !== 'production',
    // Neon exige SSL. rejectUnauthorized true valida el certificado del servidor
    // (mejora frente a NODO, que lo tenía en false).
    ssl: useSsl ? { rejectUnauthorized: true } : false,
  };
}
