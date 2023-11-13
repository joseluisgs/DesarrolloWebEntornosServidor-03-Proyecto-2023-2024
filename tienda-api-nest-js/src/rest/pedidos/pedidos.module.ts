import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';

@Module({
  controllers: [PedidosController],
  providers: [PedidosService],
})
export class PedidosModule {}
