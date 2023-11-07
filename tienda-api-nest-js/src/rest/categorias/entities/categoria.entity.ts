import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ProductoEntity } from '../../productos/entities/producto.entity'

@Entity({ name: 'categorias' }) // Case sensitive
export class CategoriaEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string

  @Column({ type: 'varchar', length: 255, unique: true })
  nombre: string

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

  // Relación uno a muchos con la entidad ProductoEntity
  // Un producto pertenece a una categoría
  // Una categoría tiene muchos productos
  // 1:N
  @OneToMany(() => ProductoEntity, (producto) => producto.categoria)
  productos: ProductoEntity[]
}
