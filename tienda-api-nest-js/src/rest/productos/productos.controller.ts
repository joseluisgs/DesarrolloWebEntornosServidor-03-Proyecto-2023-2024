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
import { ProductosService } from './productos.service'
import { CreateProductoDto } from './dto/create-producto.dto'
import { UpdateProductoDto } from './dto/update-producto.dto'

@Controller('productos')
export class ProductosController {
  private readonly logger: Logger = new Logger(ProductosController.name)

  constructor(private readonly productosService: ProductosService) {}

  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    this.logger.log('Create producto')
    return this.productosService.create(createProductoDto)
  }

  @Get()
  async findAll() {
    this.logger.log('Find all productos')
    return this.productosService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    this.logger.log('Find one producto')
    return this.productosService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    this.logger.log('Update producto')
    return this.productosService.update(+id, updateProductoDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.log('Remove producto')
    return this.productosService.remove(+id)
  }
}
