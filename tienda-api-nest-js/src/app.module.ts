import { Module } from '@nestjs/common'
import { ProductosModule } from './rest/productos/productos.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    // Lo primero es cargar la configuración de la aplicación y que esta esté disponible en el módulo raíz
    ConfigModule.forRoot(),
    // Luego se cargan los módulos de la aplicación
    ProductosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
