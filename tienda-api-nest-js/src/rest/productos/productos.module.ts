import { Module } from '@nestjs/common'
import { ProductosService } from './productos.service'
import { ProductosController } from './productos.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductoEntity } from './entities/producto.entity'
import { ProductosMapper } from './mappers/productos.mapper'
import { CategoriaEntity } from '../categorias/entities/categoria.entity'
import { NotificationsModule } from '../../websockets/notifications/notifications.module'
import { StorageModule } from '../storage/storage.module'
import { CacheModule } from '@nestjs/cache-manager'

@Module({
  // Importamos los repositorios (son modulos) a usar, que los crea automáticamente TypeORM
  imports: [
    TypeOrmModule.forFeature([ProductoEntity]), // Importamos el repositorio de productos
    TypeOrmModule.forFeature([CategoriaEntity]), // Importamos el repositorio de categorias
    StorageModule, // Importamos el módulo de storage
    NotificationsModule, // Importamos el módulo de notificaciones
    CacheModule.register(), // Importamos el módulo de cache
  ],
  controllers: [ProductosController],
  providers: [ProductosService, ProductosMapper],
})
export class ProductosModule {}
