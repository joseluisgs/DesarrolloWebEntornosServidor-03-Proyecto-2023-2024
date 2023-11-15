import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity({ name: 'user_roles' })
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_id' })
  userId: number

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role

  @ManyToOne(() => User, (user) => user.roles)
  @JoinColumn({ name: 'user_id' })
  usuario: User
}
