import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'productos' }) // Nombre de la tabla (es case sensitive!!!)
export class ProductoEntity {
  @PrimaryGeneratedColumn() // Autoincremental
  id: number

  @Column({ type: 'varchar', length: 255, nullable: false })
  marca: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  modelo: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string

  @Column({ type: 'double precision', default: 0.0 })
  precio: number

  @Column({ type: 'integer', default: 0 })
  stock: number

  @Column({ type: 'text', default: 'https://via.placeholder.com/150' })
  imagen: string

  @Column({ type: 'uuid' })
  uuid: string

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

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean

  @Column({ name: 'categoria_id', type: 'uuid', nullable: true })
  categoriaId: string
}
