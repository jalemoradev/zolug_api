import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { buildDataSourceOptions } from './typeorm.config';

// El CLI de TypeORM no pasa por el ConfigModule de Nest, así que carga el .env
// manualmente antes de construir las opciones.
config();

export default new DataSource(buildDataSourceOptions());
