import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { PedidosService } from './pedidos.service'
import { UpdatePedidoDto } from './dto/update-pedido.dto'
import { CreatePedidoDto } from './dto/create-pedido.dto'

@Controller('pedidos')
export class PedidosController {
  private readonly logger = new Logger(PedidosController.name)

  constructor(private readonly pedidosService: PedidosService) {}

  @Get()
  async findAll() {
    this.logger.log('Buscando todos los pedidos')
    return await this.pedidosService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Buscando pedido con id ${id}`)
    return await this.pedidosService.findOne(id)
  }

  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.pedidosService.update(+id, updatePedidoDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pedidosService.remove(+id)
  }
}
