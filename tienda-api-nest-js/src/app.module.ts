import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ProductosModule } from './rest/productos/productos.module';

@Module({
  imports: [ProductosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
