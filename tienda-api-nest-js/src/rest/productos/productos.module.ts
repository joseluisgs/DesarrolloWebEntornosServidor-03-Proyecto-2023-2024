import { Module } from '@nestjs/common'
import { ProductosService } from './productos.service'
import { ProductosController } from './productos.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductoEntity } from './entities/producto.entity'
import { ProductosMapper } from './mappers/productos.mapper/productos.mapper'
import { CategoriaEntity } from '../categorias/entities/categoria.entity'

@Module({
  // Importamos los repositorios a usar, que los crea automáticamente TypeORM
  imports: [
    TypeOrmModule.forFeature([ProductoEntity]), // Importamos el repositorio de productos
    TypeOrmModule.forFeature([CategoriaEntity]), // Importamos el repositorio de categorias
  ],
  controllers: [ProductosController],
  providers: [ProductosService, ProductosMapper],
})
export class ProductosModule {}
