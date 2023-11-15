import {
  BadRequestException,
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
import { InjectModel } from '@nestjs/mongoose'
import { Pedido, PedidoDocument } from '../pedidos/schemas/pedido.schema'
import { PaginateModel } from 'mongoose'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)

  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly usuariosMapper: UsuariosMapper,
    private readonly bcryptService: BcryptService,
    @InjectModel(Pedido.name)
    private pedidosRepository: PaginateModel<PedidoDocument>,
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

  async deleteUserProfileById(idUser: number) {
    this.logger.log(`deleteUserById: ${idUser}`)
    const user = await this.usuariosRepository.findOneBy({ id: idUser })
    if (!user) {
      throw new NotFoundException(`User not found with id ${idUser}`)
    }
    const existsPedidos = await this.pedidosRepository.exists({
      idUsuario: user.id,
    })
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

  async updateUserProfileById(id: number, updateUserDto: UpdateUserDto) {
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
    // No puedo cambiar los roles
    delete updateUserDto.roles
    Object.assign(user, updateUserDto)
    // Actualizamos los datos del usuario
    const updatedUser = await this.usuariosRepository.save(user)
    // Devolver los datos mappeados
    return this.usuariosMapper.toResponseDto(updatedUser)
  }

  private async findByEmail(email: string) {
    this.logger.log(`findByEmail: ${email}`)
    return await this.usuariosRepository.findOneBy({ email })
  }
}
