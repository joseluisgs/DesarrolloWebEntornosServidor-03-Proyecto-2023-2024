import { Module } from '@nestjs/common'
import { ProductosService } from './productos.service'
import { ProductosController } from './productos.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductoEntity } from './entities/producto.entity'

@Module({
  // Importamos los repositorios a usar, que los crea automáticamente TypeORM
  imports: [TypeOrmModule.forFeature([ProductoEntity])],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}
