import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreatePedidoDto } from './dto/create-pedido.dto'
import { UpdatePedidoDto } from './dto/update-pedido.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Pedido, PedidoDocument } from './schemas/pedido.schema'
import { PaginateModel } from 'mongoose' // has necesitado importar el esquema en el createFactory del esquema

export const PedidosOrderByValues: string[] = ['_id', 'idUsuario'] // Lo usamos en los pipes
export const PedidosOrderValues: string[] = ['asc', 'desc'] // Lo usamos en los pipes

@Injectable()
export class PedidosService {
  private logger = new Logger(PedidosService.name)

  // Inyectamos los repositorios!!
  constructor(
    @InjectModel(Pedido.name)
    private pedidosRepository: PaginateModel<PedidoDocument>,
  ) {}

  async findAll(page: number, limit: number, orderBy: string, order: string) {
    this.logger.log(
      `Buscando todos los pedidos con paginación y filtros: ${JSON.stringify({
        page,
        limit,
        orderBy,
        order,
      })}`,
    )
    // Aquí iría la query de ordenación y paginación
    const options = {
      page,
      limit,
      sort: {
        [orderBy]: order,
      },
      collection: 'es_ES', // para que use la configuración de idioma de España
    }

    return await this.pedidosRepository.paginate({}, options)
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
    this.logger.log(`Creando pedido ${JSON.stringify(createPedidoDto)}`)
    return 'This action adds a new pedido'
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto) {
    this.logger.log(
      `Actualizando pedido con id ${id} y ${JSON.stringify(updatePedidoDto)}`,
    )
    return `This action updates a #${id} pedido`
  }

  async remove(id: string) {
    this.logger.log(`Eliminando pedido con id ${id}`)
    return `This action removes a #${id} pedido`
  }

  async findPedidosPorUsuario(idUsuario: number) {
    this.logger.log(`Buscando pedidos por usuario ${idUsuario}`)
    return await this.pedidosRepository.find({ idUsuario }).exec()
  }
}
