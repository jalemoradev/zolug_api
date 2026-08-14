import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Catálogo de roles del usuario en el sistema.
 * Valores: SUPER, ADMINISTRATOR, COORDINATOR, ADVISOR, LAWYER…
 * Estructura estándar `types_` del modelo de datos de ZOLUG.
 */
@Entity({ name: 'types_user_roles' })
export class TypeUserRole {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** Identificador estable, único. No cambia aunque cambie la etiqueta. */
  @Column({ type: 'varchar', unique: true })
  code!: string;

  /** El texto que ve el usuario. */
  @Column({ type: 'varchar' })
  label!: string;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
