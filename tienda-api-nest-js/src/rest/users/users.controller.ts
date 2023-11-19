import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CacheInterceptor } from '@nestjs/cache-manager'
import { CreateUserDto } from './dto/create-user.dto'
import { Roles, RolesAuthGuard } from '../auth/guards/roles-auth.guard'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { IdValidatePipe } from '../pedidos/pipes/id-validate.pipe'
import { CreatePedidoDto } from '../pedidos/dto/create-pedido.dto'
import { UpdatePedidoDto } from '../pedidos/dto/update-pedido.dto'
import { ApiExcludeController } from '@nestjs/swagger'

@Controller('users')
@UseInterceptors(CacheInterceptor) // Aplicar el interceptor aquí de cache
@UseGuards(JwtAuthGuard, RolesAuthGuard) // Aplicar el guard aquí para autenticados con JWT y Roles (lo aplico a nivel de controlador)
@ApiExcludeController()
export class UsersController {
  private readonly logger = new Logger(UsersController.name)

  constructor(private readonly usersService: UsersService) {}

  /// GESTION, SOLO ADMINISTRADOR

  @Get()
  @Roles('ADMIN')
  async findAll() {
    this.logger.log('findAll')
    return await this.usersService.findAll()
  }

  @Get(':id')
  @Roles('ADMIN')
  async findOne(id: number) {
    this.logger.log(`findOne: ${id}`)
    return await this.usersService.findOne(id)
  }

  @Post()
  @HttpCode(201)
  @Roles('ADMIN')
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log('create')
    return await this.usersService.create(createUserDto)
  }

  @Put(':id')
  @Roles('ADMIN')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    this.logger.log(`update: ${id}`)
    return await this.usersService.update(id, updateUserDto, true)
  }

  // ME/PROFILE, CUALQUIER USUARIO AUTENTICADO
  @Get('me/profile')
  @Roles('USER')
  async getProfile(@Req() request: any) {
    return request.user
  }

  @Delete('me/profile')
  @HttpCode(204)
  @Roles('USER')
  async deleteProfile(@Req() request: any) {
    return await this.usersService.deleteById(request.user.id)
  }

  @Put('me/profile')
  @Roles('USER')
  async updateProfile(
    @Req() request: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(request.user.id, updateUserDto, false)
  }

  // ME/PEDIDOS, CUALQUIER USUARIO AUTENTICADO siempre y cuando el id del usuario coincida con el id del pedido
  @Get('me/pedidos')
  async getPedidos(@Req() request: any) {
    return await this.usersService.getPedidos(request.user.id)
  }

  @Get('me/pedidos/:id')
  async getPedido(
    @Req() request: any,
    @Param('id', IdValidatePipe) id: string,
  ) {
    return await this.usersService.getPedido(request.user.id, id)
  }

  @Post('me/pedidos')
  @HttpCode(201)
  @Roles('USER')
  async createPedido(
    @Body() createPedidoDto: CreatePedidoDto,
    @Req() request: any,
  ) {
    this.logger.log(`Creando pedido ${JSON.stringify(createPedidoDto)}`)
    return await this.usersService.createPedido(
      createPedidoDto,
      request.user.id,
    )
  }

  @Put('me/pedidos/:id')
  @Roles('USER')
  async updatePedido(
    @Param('id', IdValidatePipe) id: string,
    @Body() updatePedidoDto: UpdatePedidoDto,
    @Req() request: any,
  ) {
    this.logger.log(
      `Actualizando pedido con id ${id} y ${JSON.stringify(updatePedidoDto)}`,
    )
    return await this.usersService.updatePedido(
      id,
      updatePedidoDto,
      request.user.id,
    )
  }

  @Delete('me/pedidos/:id')
  @HttpCode(204)
  @Roles('USER')
  async removePedido(
    @Param('id', IdValidatePipe) id: string,
    @Req() request: any,
  ) {
    this.logger.log(`Eliminando pedido con id ${id}`)
    await this.usersService.removePedido(id, request.user.id)
  }
}
