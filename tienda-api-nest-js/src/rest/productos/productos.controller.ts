import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ProductosService } from './productos.service'
import { CreateProductoDto } from './dto/create-producto.dto'
import { UpdateProductoDto } from './dto/update-producto.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, parse } from 'path'
import { Request } from 'express'
import { ProductoExistsGuard } from './guards/producto-id/producto-exists-guard'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'

@Controller('productos')
@UseInterceptors(CacheInterceptor) // Aplicar el interceptor aquí de cahce
export class ProductosController {
  private readonly logger: Logger = new Logger(ProductosController.name)

  constructor(private readonly productosService: ProductosService) {}

  @Get()
  @CacheKey('all_products')
  @CacheTTL(30)
  async findAll() {
    this.logger.log('Find all productos')
    return await this.productosService.findAll()
  }

  @Get(':id')
  @CacheKey('product_')
  @CacheTTL(30)
  async findOne(@Param('id') id: number) {
    this.logger.log(`Find one producto by id:${id}`)
    return await this.productosService.findOne(id)
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createProductoDto: CreateProductoDto) {
    this.logger.log(`Create producto ${createProductoDto}`)
    const createdProduct = await this.productosService.create(createProductoDto)
    // Invalidar la caché de todos los productos
    await this.productosService.invalidateCacheKey('all_products')
    return createdProduct
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    this.logger.log(`Update producto with id:${id}-${updateProductoDto}`)
    const updatedProduct = await this.productosService.update(
      id,
      updateProductoDto,
    )
    // Invalidar la caché del producto específico y de todos los productos
    await this.productosService.invalidateCacheKey(`product_${id}`)
    await this.productosService.invalidateCacheKey('all_products')
    return updatedProduct
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    this.logger.log('Remove producto with id:${id}')
    // borrado fisico
    // return await this.productosService.remove(id)
    // borrado logico
    await this.productosService.removeSoft(id)
    // Invalidar la caché del producto específico y de todos los productos
    await this.productosService.invalidateCacheKey(`product_${id}`)
    await this.productosService.invalidateCacheKey('all_products')
  }

  @Patch('/imagen/:id')
  @UseGuards(ProductoExistsGuard) // Aplicar el guard aquí
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.UPLOADS_DIR || './storage-dir',
        filename: (req, file, cb) => {
          // const fileName = uuidv4() // usamos uuid para generar un nombre único para el archivo
          const { name } = parse(file.originalname)
          const fileName = `${Date.now()}_${name.replace(/\s/g, '')}`
          const fileExt = extname(file.originalname) // extraemos la extensión del archivo
          cb(null, `${fileName}${fileExt}`) // llamamos al callback con el nombre del archivo
        },
      }),
      // Validación de archivos
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif']
        const maxFileSize = 1024 * 1024 // 1 megabyte
        if (!allowedMimes.includes(file.mimetype)) {
          // Note: You can customize this error message to be more specific
          cb(
            new BadRequestException(
              'Fichero no soportado. No es del tipo imagen válido',
            ),
            false,
          )
        } else if (file.size > maxFileSize) {
          cb(
            new BadRequestException(
              'El tamaño del archivo no puede ser mayor a 1 megabyte.',
            ),
            false,
          )
        } else {
          cb(null, true)
        }
      },
    }),
  ) // 'file' es el nombre del campo en el formulario
  async updateImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    this.logger.log(`Actualizando imagen al producto con ${id}:  ${file}`)

    const updatedProduct = await this.productosService.updateImage(
      id,
      file,
      req,
      true,
    )
    // Invalidar la caché del producto específico y de todos los productos
    await this.productosService.invalidateCacheKey(`product_${id}`)
    await this.productosService.invalidateCacheKey('all_products')
    return updatedProduct
  }
}
