import { Injectable, Logger, NotFoundException } from '@nestjs/common'
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

  async findAll() {
    this.logger.log('Find all productos')
    return await this.productoRepository.find()
  }

  async findOne(id: number) {
    this.logger.log(`Find one producto by id:${id}`)
    const patientToFound = await this.productoRepository.findOneBy({ id })
    if (!patientToFound) {
      this.logger.log(`Patient with id:${id} not found`)
      throw new NotFoundException(`Paciente con id:${id} no encontrado`)
    }
    return patientToFound
  }

  create(createProductoDto: CreateProductoDto) {
    this.logger.log('Create producto')
    return 'This action adds a new producto'
  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    this.logger.log(`Update producto by id:${id} ${updateProductoDto}`)
    return `This action updates a #${id} producto`
  }

  remove(id: number) {
    this.logger.log(`Remove producto by id:${id}`)
    return `This action removes a #${id} producto`
  }
}
