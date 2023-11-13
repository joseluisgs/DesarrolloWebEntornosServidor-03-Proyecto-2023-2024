import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { UpdatePedidoDto } from './dto/update-pedido.dto'
import { CreatePedidoDto } from './dto/create-pedido.dto'
import { OrderByValidatePipe } from './pipes/orderby-validate.pipe'
import { PedidosService } from './pedidos.service'
import { OrderValidatePipe } from './pipes/order-validate.pipe'

@Controller('pedidos')
export class PedidosController {
  private readonly logger = new Logger(PedidosController.name)

  constructor(private readonly pedidosService: PedidosService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1)) page: number = 1,
    @Query('limit', new DefaultValuePipe(20)) limit: number = 20,
    @Query('orderBy', new DefaultValuePipe('idUsuario'), OrderByValidatePipe)
    orderBy: string = 'idUsuario',
    @Query('order', new DefaultValuePipe('asc'), OrderValidatePipe)
    order: string,
  ) {
    this.logger.log('Buscando todos los pedidos')
    return await this.pedidosService.findAll(page, limit, orderBy, order)
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
