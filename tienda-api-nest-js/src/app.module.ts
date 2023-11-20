import { Module } from '@nestjs/common'
import { ProductosModule } from './rest/productos/productos.module'
import { ConfigModule } from '@nestjs/config'
import { CategoriasModule } from './rest/categorias/categorias.module'
import { StorageModule } from './rest/storage/storage.module'
import { NotificationsModule } from './websockets/notifications/notifications.module'
import { CacheModule } from '@nestjs/cache-manager'
import { DatabaseModule } from './config/database/database.module'
import { PedidosModule } from './rest/pedidos/pedidos.module'
import { AuthModule } from './rest/auth/auth.module'
import { UsersModule } from './rest/users/users.module'
import { CorsConfigModule } from './config/cors/cors.module'

@Module({
  imports: [
    // Lo primero es cargar la configuración de la aplicación y que esta esté disponible en el módulo raíz
    ConfigModule.forRoot(
      process.env.NODE_ENV === 'dev'
        ? { envFilePath: '.env.dev' || '.env' }
        : { envFilePath: '.env.prod' },
    ),
    CorsConfigModule, // Configurar el módulo de cors
    DatabaseModule, // Configurar el módulo de base de datos
    CacheModule.register(), // Configurar el módulo de caché
    AuthModule, // Inyectamos el modulo de autenticacion (JWT y Guards)
    // Luego se cargan los módulos de la aplicación
    ProductosModule,
    CategoriasModule,
    StorageModule,
    NotificationsModule,
    PedidosModule,
    UsersModule,
  ],
  providers: [],
})
export class AppModule {}
