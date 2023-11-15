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
import {UsersService} from './users.service'
import {CacheInterceptor} from '@nestjs/cache-manager'
import {CreateUserDto} from './dto/create-user.dto'
import {RolesExistsGuard} from './guards/roles-exists.guard'
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard'
import {RolesAuthGuard} from '../auth/guards/roles-auth.guard'
import {UpdateUserDto} from './dto/update-user.dto'

@UseInterceptors(CacheInterceptor) // Aplicar el interceptor aquí de cache
@UseGuards(JwtAuthGuard) // Aplicar el guard aquí para autenticados con JWT
@Controller('users')
export class UsersController {
    private readonly logger = new Logger(UsersController.name)

    constructor(private readonly usersService: UsersService) {
    }

    /// GESTION, SOLO ADMINISTRADOR

    @Get()
    @UseGuards(new RolesAuthGuard('ADMIN')) // Aplicar el guard aquí para usuarios con rol ADMIN
    async findAll() {
        this.logger.log('findAll')
        return await this.usersService.findAll()
    }

    @Get(':id')
    @UseGuards(new RolesAuthGuard('ADMIN'))
    async findOne(@Param('id', ParseIntPipe) id: number) {
        this.logger.log(`findOne: ${id}`)
        return await this.usersService.findOne(id)
    }

    @Post()
    @HttpCode(201)
    @UseGuards(new RolesAuthGuard('ADMIN'))
    @UseGuards(RolesExistsGuard) // Aplicar el guard aquí
    async create(@Body() createUserDto: CreateUserDto) {
        this.logger.log('create')
        return await this.usersService.create(createUserDto)
    }

    @Put(':id')
    @UseGuards(new RolesAuthGuard('ADMIN'))
    @UseGuards(RolesExistsGuard) // Aplicar el guard aquí para comprobar los roles que se envían
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
        this.logger.log(`update: ${id}`)
        return await this.usersService.update(id, updateUserDto, true)
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(new RolesAuthGuard('ADMIN'))
    async deleteById(@Param('id', ParseIntPipe) id: number) {
        this.logger.log(`delete: ${id}`)
        return await this.usersService.deleteById(id)
    }

    // ME/PROFILE, CUALQUIER USUARIO AUTENTICADO
    @Get('me/profile')
    async getProfile(@Req() request: any) {
        return request.user
    }

    @Delete('me/profile')
    @HttpCode(204)
    async deleteProfile(@Req() request: any) {
        return await this.usersService.deleteById(request.user.id)
    }

    @Put('me/profile')
    async updateProfile(
        @Req() request: any,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return await this.usersService.update(request.user.id, updateUserDto)
    }

    // ME/PEDIDOS, CUALQUIER USUARIO AUTENTICADO siempre y cuando el id del usuario coincida con el id del pedido
    @Get('me/pedidos')
    async getPedidos(@Req() request: any) {
        return await this.usersService.getPedidos(request.user.id)
    }
}
