import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TypeUserRole } from './type-user-role.entity';

/**
 * El usuario que inicia sesión: asesor, coordinador, administrador, abogado.
 * NO es el cliente. Se autentica por `username`.
 * Campos fieles al modelo de datos de ZOLUG (modelo-datos.md / modelo-er.html).
 */
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  username!: string;

  // select:false — nunca se carga por defecto; el login la pide explícitamente.
  @Column({ name: 'password', type: 'varchar', select: false })
  password!: string;

  @Column({ name: 'full_name', type: 'varchar' })
  fullName!: string;

  @Column({ type: 'varchar' })
  email!: string;

  @Column({ name: 'document_type', type: 'varchar', nullable: true })
  documentType?: string | null;

  @Column({ name: 'document_number', type: 'varchar', nullable: true })
  documentNumber?: string | null;

  @Column({ type: 'varchar', nullable: true })
  phone?: string | null;

  @Column({ type: 'varchar', nullable: true })
  gender?: string | null;

  @Column({ name: 'user_role_id', type: 'uuid' })
  userRoleId!: string;

  @ManyToOne(() => TypeUserRole, { eager: false })
  @JoinColumn({ name: 'user_role_id' })
  role!: TypeUserRole;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @Column({ name: 'must_change_password', type: 'boolean', default: false })
  mustChangePassword!: boolean;

  // Flujo de reset por OTP. Ambos select:false.
  @Column({ name: 'password_reset_otp', type: 'varchar', nullable: true, select: false })
  passwordResetOtp?: string | null;

  @Column({
    name: 'password_reset_otp_expires_at',
    type: 'timestamptz',
    nullable: true,
    select: false,
  })
  passwordResetOtpExpiresAt?: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
