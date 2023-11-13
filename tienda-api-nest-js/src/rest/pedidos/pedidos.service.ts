import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreatePedidoDto } from './dto/create-pedido.dto'
import { UpdatePedidoDto } from './dto/update-pedido.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Pedido, PedidoDocument } from './schemas/pedido.schema'
import { PaginateModel } from 'mongoose' // has necesitado importar el esquema en el createFactory del esquema

@Injectable()
export class PedidosService {
  private logger = new Logger(PedidosService.name)

  // Inyectamos los repositorios!!
  constructor(
    @InjectModel(Pedido.name)
    private pedidosRepository: PaginateModel<PedidoDocument>,
  ) {}

  async findAll() {
    this.logger.log('Buscando todos los pedidos')
    return await this.pedidosRepository.find().exec()
  }

  async findOne(id: string) {
    this.logger.log(`Buscando pedido con id ${id}`)
    const finded = await this.pedidosRepository.findById(id).exec()
    if (!finded) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`)
    }
    return finded
  }

  async create(createPedidoDto: CreatePedidoDto) {
    return 'This action adds a new pedido'
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto) {
    return `This action updates a #${id} pedido`
  }

  async remove(id: number) {
    return `This action removes a #${id} pedido`
  }
}
