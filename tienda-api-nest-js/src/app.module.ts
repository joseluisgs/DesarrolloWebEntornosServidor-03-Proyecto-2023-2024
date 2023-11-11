import { Module } from '@nestjs/common'
import { ProductosModule } from './rest/productos/productos.module'
import { ConfigModule } from '@nestjs/config'
import { CategoriasModule } from './rest/categorias/categorias.module'
import { StorageModule } from './rest/storage/storage.module'
import { NotificationsModule } from './websockets/notifications/notifications.module'
import { CacheModule } from '@nestjs/cache-manager'
import { DatabaseModule } from './config/database/database.module'

@Module({
  imports: [
    // Lo primero es cargar la configuración de la aplicación y que esta esté disponible en el módulo raíz
    ConfigModule.forRoot(),
    DatabaseModule, // Configurar el módulo de base de datos
    CacheModule.register(), // Configurar el módulo de caché
    // Luego se cargan los módulos de la aplicación
    ProductosModule,
    CategoriasModule,
    StorageModule,
    NotificationsModule,
  ],
  controllers: [],
})
export class AppModule {}
