import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { buildDataSourceOptions } from '../../config/typeorm.config';

/**
 * Conexión a la base de datos (Neon Postgres). Usa la MISMA factory que el CLI
 * de migraciones (data-source.ts), para que runtime y migraciones no diverjan.
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => buildDataSourceOptions(),
    }),
  ],
})
export class DatabaseModule {}
