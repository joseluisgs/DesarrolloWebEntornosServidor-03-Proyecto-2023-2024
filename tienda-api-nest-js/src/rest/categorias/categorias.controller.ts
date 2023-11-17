import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { CategoriasService } from './categorias.service'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { Paginate, PaginateQuery } from 'nestjs-paginate'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Roles, RolesAuthGuard } from '../auth/guards/roles-auth.guard'

@Controller('categorias')
@UseInterceptors(CacheInterceptor) // Aplicar el interceptor aquí de cahce
@UseGuards(JwtAuthGuard, RolesAuthGuard) // Aplicar el guard aquí para autenticados con JWT y Roles (lo aplico a nivel de controlador)
export class CategoriasController {
  private readonly logger = new Logger(CategoriasController.name)

  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  @CacheKey('all_categories')
  @CacheTTL(30)
  @Roles('ADMIN')
  async findAll(@Paginate() query: PaginateQuery) {
    this.logger.log('Find all categorias')
    return await this.categoriasService.findAll(query)
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Find one categoria by id:${id}`)
    return await this.categoriasService.findOne(id)
  }

  @Post()
  @HttpCode(201)
  @Roles('ADMIN')
  async create(@Body() createCategoriaDto: CreateCategoriaDto) {
    this.logger.log(`Create categoria ${createCategoriaDto}`)
    return await this.categoriasService.create(createCategoriaDto)
  }

  @Put(':id')
  @Roles('ADMIN')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    this.logger.log(`Update categoria with id:${id} - ${updateCategoriaDto}`)
    return await this.categoriasService.update(id, updateCategoriaDto)
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles('ADMIN')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Remove categoria with id:${id}`)
    // Borrado fisico
    //await this.categoriasService.remove(id)
    // Borrado logico
    await this.categoriasService.removeSoft(id)
  }
}
