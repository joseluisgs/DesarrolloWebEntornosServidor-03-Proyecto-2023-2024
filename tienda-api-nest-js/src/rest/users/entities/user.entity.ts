import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { UserRole } from './user-role.entity'

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombre: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  apellidos: string

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean

  @OneToMany(() => UserRole, (userRole) => userRole.usuario, { eager: true })
  roles: UserRole[]
}
