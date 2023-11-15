import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CacheInterceptor } from '@nestjs/cache-manager'
import { CreateUserDto } from './dto/create-user.dto'
import { RolesExistsGuard } from './guards/roles-exists.guard'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesAuthGuard } from '../auth/guards/roles-auth.guard'

@UseInterceptors(CacheInterceptor) // Aplicar el interceptor aquí de cache
@UseGuards(JwtAuthGuard) // Aplicar el guard aquí para autenticados con JWT
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name)

  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(new RolesAuthGuard('ADMIN')) // Aplicar el guard aquí para usuarios con rol ADMIN
  async findAll() {
    this.logger.log('findAll')
    return await this.usersService.findAll()
  }

  @Get(':id')
  async findOne(id: number) {
    this.logger.log(`findOne: ${id}`)
    return await this.usersService.findOne(id)
  }

  @Post()
  @HttpCode(201)
  @UseGuards(RolesExistsGuard) // Aplicar el guard aquí
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log('create')
    return await this.usersService.create(createUserDto)
  }
}
