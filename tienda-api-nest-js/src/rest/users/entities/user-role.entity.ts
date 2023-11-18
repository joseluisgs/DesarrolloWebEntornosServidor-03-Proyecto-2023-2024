import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Usuario } from './user.entity'

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity({ name: 'user_roles' })
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number

  // Lo almaceno como varchar porque es más fácil de leer
  @Column({ type: 'varchar', length: 50, nullable: false, default: Role.USER })
  role: Role

  @ManyToOne(() => Usuario, (user) => user.roles)
  @JoinColumn({ name: 'user_id' })
  usuario: Usuario
}
