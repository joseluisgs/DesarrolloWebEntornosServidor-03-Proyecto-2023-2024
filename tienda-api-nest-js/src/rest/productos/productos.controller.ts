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
import { ProductoExistsGuard } from './guards/producto-exists.guard'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Roles, RolesAuthGuard } from '../auth/guards/roles-auth.guard'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ResponseProductoDto } from './dto/response-producto.dto'

@Controller('productos')
@UseInterceptors(CacheInterceptor) // Aplicar el interceptor aquí de cahce
@ApiTags('Productos') // Aplicar el decorador en el controlador
export class ProductosController {
  private readonly logger: Logger = new Logger(ProductosController.name)

  constructor(private readonly productosService: ProductosService) {}

  @Get()
  @CacheKey('all_products')
  @CacheTTL(30)
  @ApiResponse({
    status: 200,
    description:
      'Lista de productos paginada. Se puede filtrar por limite, pagina sortBy, filter y search',
    type: Paginated<ResponseProductoDto>,
  })
  @ApiQuery({
    description: 'Filtro por limite por pagina',
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    description: 'Filtro por pagina',
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    description: 'Filtro de ordenación: campo:ASC|DESC',
    name: 'sortBy',
    required: false,
    type: String,
  })
  @ApiQuery({
    description: 'Filtro de busqueda: filter.campo = $eq:valor',
    name: 'filter',
    required: false,
    type: String,
  })
  @ApiQuery({
    description: 'Filtro de busqueda: search = valor',
    name: 'search',
    required: false,
    type: String,
  })
  async findAll(@Paginate() query: PaginateQuery) {
    this.logger.log('Find all productos')
    return await this.productosService.findAll(query)
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado',
    type: ResponseProductoDto,
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador del producto',
    type: Number,
  })
  @ApiNotFoundResponse({
    description: 'Producto no encontrado',
  })
  @ApiBadRequestResponse({
    description: 'El id del producto no es válido',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Find one producto by id:${id}`)
    return await this.productosService.findOne(id)
  }

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, RolesAuthGuard) // Aplicar el guard aquí
  @Roles('ADMIN')
  @ApiBearerAuth() // Indicar que se requiere autenticación con JWT en Swagger
  @ApiResponse({
    status: 201,
    description: 'Producto creado',
    type: ResponseProductoDto,
  })
  @ApiBody({
    description: 'Datos del producto a crear',
    type: CreateProductoDto,
  })
  @ApiBadRequestResponse({
    description:
      'El algunos de los campos no es válido según la especificación del DTO',
  })
  @ApiBadRequestResponse({
    description: 'La categoría no existe o no es válida',
  })
  async create(@Body() createProductoDto: CreateProductoDto) {
    this.logger.log(`Create producto ${createProductoDto}`)
    return await this.productosService.create(createProductoDto)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard) // Aplicar el guard aquí
  @Roles('ADMIN')
  @ApiBearerAuth() // Indicar que se requiere autenticación con JWT en Swagger
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado',
    type: ResponseProductoDto,
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador del producto',
    type: Number,
  })
  @ApiBody({
    description: 'Datos del producto a actualizar',
    type: UpdateProductoDto,
  })
  @ApiNotFoundResponse({
    description: 'Producto no encontrado',
  })
  @ApiBadRequestResponse({
    description:
      'El algunos de los campos no es válido según la especificación del DTO',
  })
  @ApiBadRequestResponse({
    description: 'La categoría no existe o no es válida',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    this.logger.log(`Update producto with id:${id}-${updateProductoDto}`)
    return await this.productosService.update(id, updateProductoDto)
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard, RolesAuthGuard) // Aplicar el guard aquí
  @Roles('ADMIN')
  @ApiBearerAuth() // Indicar que se requiere autenticación con JWT en Swagger
  @ApiResponse({
    status: 204,
    description: 'Producto eliminado',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador del producto',
    type: Number,
  })
  @ApiNotFoundResponse({
    description: 'Producto no encontrado',
  })
  @ApiBadRequestResponse({
    description: 'El id del producto no es válido',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    this.logger.log('Remove producto with id:${id}')
    // borrado fisico
    // return await this.productosService.remove(id)
    // borrado logico
    await this.productosService.removeSoft(id)
  }

  @Patch('/imagen/:id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard) // Aplicar el guard aquí
  @Roles('ADMIN')
  @UseGuards(ProductoExistsGuard) // Aplicar el guard aquí
  @ApiBearerAuth() // Indicar que se requiere autenticación con JWT en Swagger
  @ApiResponse({
    status: 200,
    description: 'Imagen actualizada',
    type: ResponseProductoDto,
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador del producto',
    type: Number,
  })
  @ApiProperty({
    name: 'file',
    description: 'Fichero de imagen',
    type: 'string',
    format: 'binary',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Fichero de imagen',
    type: FileInterceptor('file'),
  })
  @ApiNotFoundResponse({
    description: 'Producto no encontrado',
  })
  @ApiBadRequestResponse({
    description: 'El id del producto no es válido',
  })
  @ApiBadRequestResponse({
    description: 'El fichero no es válido o de un tipo no soportado',
  })
  @ApiBadRequestResponse({
    description: 'El fichero no puede ser mayor a 1 megabyte',
  })
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

    return await this.productosService.updateImage(id, file, req, true)
  }
}
