import { Injectable, Logger } from '@nestjs/common'
import { CreateProductoDto } from './dto/create-producto.dto'
import { UpdateProductoDto } from './dto/update-producto.dto'

@Injectable()
export class ProductosService {
  private logger: Logger = new Logger(ProductosService.name)

  create(createProductoDto: CreateProductoDto) {
    this.logger.log('Create producto')
    return 'This action adds a new producto'
  }

  findAll() {
    this.logger.log('Find all productos')
    return `This action returns all productos`
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
