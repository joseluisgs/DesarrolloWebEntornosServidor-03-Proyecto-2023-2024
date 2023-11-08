import {Body, Controller, Delete, Get, HttpCode, Logger, Param, Post, Put,} from '@nestjs/common'
import {ProductosService} from './productos.service'
import {CreateProductoDto} from './dto/create-producto.dto'
import {UpdateProductoDto} from './dto/update-producto.dto'

@Controller('productos')
export class ProductosController {
    private readonly logger: Logger = new Logger(ProductosController.name)

    constructor(private readonly productosService: ProductosService) {
    }

    @Get()
    async findAll() {
        this.logger.log('Find all productos')
        return await this.productosService.findAll()
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        this.logger.log(`Find one producto by id:${id}`)
        return await this.productosService.findOne(id)
    }

    @Post()
    @HttpCode(201)
    async create(@Body() createProductoDto: CreateProductoDto) {
        this.logger.log(`Create producto ${createProductoDto}`)
        return await this.productosService.create(createProductoDto)
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updateProductoDto: UpdateProductoDto,
    ) {
        this.logger.log(`Update producto with id:${id}-${updateProductoDto}`)
        return await this.productosService.update(id, updateProductoDto)
    }

    @Delete(':id')
    @HttpCode(204)
    async remove(@Param('id') id: number) {
        this.logger.log('Remove producto with id:${id}')
        // borrado fisico
        // return await this.productosService.remove(id)
        // borrado logico
        return await this.productosService.removeSoft(id)
    }
}
