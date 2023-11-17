import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Usuario } from './entities/user.entity'
import { UsuariosMapper } from './mappers/usuarios.mapper'
import { CreateUserDto } from './dto/create-user.dto'
import { Role, UserRole } from './entities/user-role.entity'
import { BcryptService } from './bcrypt.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { PedidosService } from '../pedidos/pedidos.service'
import { CreatePedidoDto } from '../pedidos/dto/create-pedido.dto'
import { UpdatePedidoDto } from '../pedidos/dto/update-pedido.dto'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)

  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly pedidosService: PedidosService,
    private readonly usuariosMapper: UsuariosMapper,
    private readonly bcryptService: BcryptService,
  ) {}

  async findAll() {
    this.logger.log('findAll')
    return (await this.usuariosRepository.find()).map((u) =>
      this.usuariosMapper.toResponseDto(u),
    )
  }

  async findOne(id: number) {
    this.logger.log(`findOne: ${id}`)
    return this.usuariosMapper.toResponseDto(
      await this.usuariosRepository.findOneBy({ id }),
    )
  }

  async create(createUserDto: CreateUserDto) {
    this.logger.log('create')
    // Validamos que el username no exista y no exista email en la base de datos
    const existingUser = await Promise.all([
      this.findByUsername(createUserDto.username),
      this.findByEmail(createUserDto.email),
    ])
    if (existingUser[0]) {
      throw new BadRequestException('username already exists')
    }

    if (existingUser[1]) {
      throw new BadRequestException('email already exists')
    }
    const hashPassword = await this.bcryptService.hash(createUserDto.password)

    // necesito insertar el usuario en la tabla de usuarios y luego en la tabla de roles
    const usuario = this.usuariosMapper.toEntity(createUserDto)
    usuario.password = hashPassword
    const user = await this.usuariosRepository.save(usuario)
    // Si no tiene roles, le asignamos el rol de usuario y lo guardamos en la tabla de roles
    const roles = createUserDto.roles || [Role.USER]
    const userRoles = roles.map((role) => ({ usuario: user, role: Role[role] }))
    const savedUserRoles = await this.userRoleRepository.save(userRoles)

    // Devolvemos el usuario con los roles
    return this.usuariosMapper.toResponseDtoWithRoles(user, savedUserRoles)
  }

  // Método para indicar si el una aray de roles de tipo string estan en el enum de roles de usuario
  validateRoles(roles: string[]): boolean {
    return roles.every((role) => Role[role])
  }

  async findByUsername(username: string) {
    this.logger.log(`findByUsername: ${username}`)
    return await this.usuariosRepository.findOneBy({ username })
  }

  async validatePassword(password: string, hashPassword: string) {
    this.logger.log(`validatePassword`)
    return await this.bcryptService.isMatch(password, hashPassword)
  }

  async deleteById(idUser: number) {
    this.logger.log(`deleteUserById: ${idUser}`)
    const user = await this.usuariosRepository.findOneBy({ id: idUser })
    if (!user) {
      throw new NotFoundException(`User not found with id ${idUser}`)
    }
    const existsPedidos = await this.pedidosService.userExists(user.id)
    // Si existen pedidos, hacemos borrado logico
    if (existsPedidos) {
      user.updatedAt = new Date()
      user.isDeleted = true
      return await this.usuariosRepository.save(user)
    } else {
      // Si no existen pedidos, hacemos borrado fisico
      // borramos de la tabla de roles
      for (const userRole of user.roles) {
        await this.userRoleRepository.remove(userRole)
      }
      return await this.usuariosRepository.delete({ id: user.id })
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    updateRoles: boolean = false,
  ) {
    this.logger.log(
      `updateUserProfileById: ${id} with ${JSON.stringify(updateUserDto)}`,
    )
    const user = await this.usuariosRepository.findOneBy({ id })
    if (!user) {
      throw new NotFoundException(`User not found with id ${id}`)
    }
    // Si el usuario quiere cambiar el username, validamos que no exista en la base de datos y si existe no sea yo mismo
    if (updateUserDto.username) {
      const existingUser = await this.findByUsername(updateUserDto.username)
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('username already exists')
      }
    }
    // Si el usuario quiere cambiar el email, validamos que no exista en la base de datos y si existe no sea yo mismo
    if (updateUserDto.email) {
      const existingUser = await this.findByEmail(updateUserDto.email)
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('email already exists')
      }
    }
    // Si el usuario quiere cambiar el password, lo hasheamos
    if (updateUserDto.password) {
      updateUserDto.password = await this.bcryptService.hash(
        updateUserDto.password,
      )
    }
    // No sobrescribes los roles actuales del usuario cuando actualizas
    const rolesBackup = [...user.roles]
    Object.assign(user, updateUserDto)

    if (updateRoles) {
      // Borramos los roles antiguos y añadimos los nuevos
      for (const userRole of rolesBackup) {
        await this.userRoleRepository.remove(userRole)
      }
      const roles = updateUserDto.roles || [Role.USER]
      const userRoles = roles.map((role) => ({
        usuario: user,
        role: Role[role],
      }))
      user.roles = await this.userRoleRepository.save(userRoles)
    } else {
      // Restauramos los roles originales porque no queríamos actualizarlos
      user.roles = rolesBackup
    }

    const updatedUser = await this.usuariosRepository.save(user)

    // Devolver los datos mappeados
    return this.usuariosMapper.toResponseDto(updatedUser)
  }

  async getPedidos(id: number) {
    return await this.pedidosService.getPedidosByUser(id)
  }

  async getPedido(idUser: number, idPedido: string) {
    const pedido = await this.pedidosService.findOne(idPedido)
    console.log(pedido.idUsuario)
    console.log(idUser)
    if (pedido.idUsuario != idUser) {
      throw new ForbiddenException(
        'Do not have permission to access this resource',
      )
    }
    return pedido
  }

  async createPedido(createPedidoDto: CreatePedidoDto, userId: number) {
    this.logger.log(`Creando pedido ${JSON.stringify(createPedidoDto)}`)
    if (createPedidoDto.idUsuario != userId) {
      throw new BadRequestException(
        'Producto idUsuario must be the same as the authenticated user',
      )
    }
    return await this.pedidosService.create(createPedidoDto)
  }

  async updatePedido(
    id: string,
    updatePedidoDto: UpdatePedidoDto,
    userId: number,
  ) {
    this.logger.log(
      `Actualizando pedido con id ${id} y ${JSON.stringify(updatePedidoDto)}`,
    )
    if (updatePedidoDto.idUsuario != userId) {
      throw new BadRequestException(
        'Producto idUsuario must be the same as the authenticated user',
      )
    }
    const pedido = await this.pedidosService.findOne(id)
    if (pedido.idUsuario != userId) {
      throw new ForbiddenException(
        'Do not have permission to access this resource',
      )
    }
    return await this.pedidosService.update(id, updatePedidoDto)
  }

  async removePedido(idPedido: string, userId: number) {
    this.logger.log(`removePedido: ${idPedido}`)
    const pedido = await this.pedidosService.findOne(idPedido)
    if (pedido.idUsuario != userId) {
      throw new ForbiddenException(
        'Do not have permission to access this resource',
      )
    }
    return await this.pedidosService.remove(idPedido)
  }

  private async findByEmail(email: string) {
    this.logger.log(`findByEmail: ${email}`)
    return await this.usuariosRepository.findOneBy({ email })
  }
}
