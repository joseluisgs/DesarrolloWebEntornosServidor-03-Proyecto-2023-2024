import { Injectable, Logger } from '@nestjs/common'
import { CreateProductoDto } from './dto/create-producto.dto'
import { UpdateProductoDto } from './dto/update-producto.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductoEntity } from './entities/producto.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ProductosService {
  private logger: Logger = new Logger(ProductosService.name)

  // Inmyectamos el repositorio de la entidad ProductoEntity
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  create(createProductoDto: CreateProductoDto) {
    this.logger.log('Create producto')
    return 'This action adds a new producto'
  }

  async findAll() {
    this.logger.log('Find all productos')
    return await this.productoRepository.find()
  }

  findOne(id: number) {
    this.logger.log('Find one producto')
    return `This action returns a #${id} producto`
  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    this.logger.log('Update producto')
    return `This action updates a #${id} producto`
  }

  remove(id: number) {
    this.logger.log('Remove producto')
    return `This action removes a #${id} producto`
  }
}
