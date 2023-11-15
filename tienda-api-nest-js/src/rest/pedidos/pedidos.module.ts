import { Module } from '@nestjs/common'
import { PedidosService } from './pedidos.service'
import { PedidosController } from './pedidos.controller'
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose'
import { Pedido } from './schemas/pedido.schema'
import * as mongoosePaginate from 'mongoose-paginate-v2'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductoEntity } from '../productos/entities/producto.entity'
import { PedidosMapper } from './mappers/pedidos.mapper'

@Module({
  // El primer paso es en el módulo del recurso a paginar, debemos importar el plugin de paginación
  // Esto lo hacemos así porque ya vamos a añadir el plugin de paginación a todos los esquemas
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Pedido.name,
        useFactory: () => {
          const schema = SchemaFactory.createForClass(Pedido)
          schema.plugin(mongoosePaginate)
          return schema
        },
      },
    ]),
    TypeOrmModule.forFeature([ProductoEntity]), // Importamos el repositorio de productos
  ],
  controllers: [PedidosController],
  providers: [PedidosService, PedidosMapper],
})
export class PedidosModule {}
