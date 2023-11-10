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

@Controller('productos')
export class ProductosController {
  private readonly logger: Logger = new Logger(ProductosController.name)

  constructor(private readonly productosService: ProductosService) {}

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
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    this.logger.log(`Update producto with id:${id}-${updateProductoDto}`)
    return await this.productosService.update(id, updateProductoDto)
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    this.logger.log('Remove producto with id:${id}')
    // borrado fisico
    // return await this.productosService.remove(id)
    // borrado logico
    return await this.productosService.removeSoft(id)
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
  updateImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    this.logger.log(`Actualizando imagen al producto con ${id}:  ${file}`)

    return this.productosService.updateImage(id, file, req, true)
  }
}
