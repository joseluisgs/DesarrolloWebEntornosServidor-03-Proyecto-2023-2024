import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { CategoriaEntity } from '../../categorias/entities/categoria.entity'

@Entity({ name: 'productos' }) // Nombre de la tabla (es case sensitive!!!)
export class ProductoEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' }) // Autoincremental, le pongo bigint porque en postgresql el tipo serial es bigint
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

  // Relación muchos a uno con la entidad CategoriaEntity
  // Un producto pertenece a una categoría
  // Una categoría tiene muchos productos
  // N:1
  @ManyToOne(() => CategoriaEntity, (categoria) => categoria.productos)
  @JoinColumn({ name: 'categoria_id' }) // Especifica el nombre de la columna
  categoria: CategoriaEntity
}
