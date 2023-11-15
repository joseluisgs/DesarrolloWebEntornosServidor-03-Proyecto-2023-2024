import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Usuario } from './entities/user.entity'
import { UsuariosMapper } from './mappers/usuarios.mapper'
import { CreateUserDto } from './dto/create-user.dto'
import { Role, UserRole } from './entities/user-role.entity'
import { BcryptService } from './bcrypt.service'

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
    // Validamos que el username no exista
    const userByUsername = await this.findByUsername(createUserDto.username)
    if (userByUsername) {
      throw new BadRequestException('username already exists')
    }
    // Validamos que el email no exista
    const userByEmail = await this.findByEmail(createUserDto.email)
    if (userByEmail) {
      throw new BadRequestException('email already exists')
    }
    const hashPassword = await this.bcryptService.hash(createUserDto.password)
    // necesito insertar el usuario en la tabla de usuarios y luego en la tabla de roles
    const usuario = this.usuariosMapper.toEntity(createUserDto)
    usuario.password = hashPassword
    console.log(usuario)
    const user = await this.usuariosRepository.save(usuario)
    console.log(user)
    // insertamos todos los roles del usuario en la tabla de roles con el id del usuario y el rol
    const roles = createUserDto.roles.map((role) => {
      const userRole = new UserRole()
      userRole.usuario = user
      userRole.role = Role[role]
      return userRole
    })
    const userRoles = await this.userRoleRepository.save(roles)
    return this.usuariosMapper.toResponseDtoWithRoles(user, userRoles)
  }

  // Método para indicar si el una aray de roles de tipo string estan en el enum de roles de usuario
  validateRoles(roles: string[]): boolean {
    return roles.every((role) => Role[role])
  }

  private async findByUsername(username: string) {
    this.logger.log(`findByUsername: ${username}`)
    return await this.usuariosRepository.findOneBy({ username })
  }

  private async findByEmail(email: string) {
    this.logger.log(`findByEmail: ${email}`)
    return await this.usuariosRepository.findOneBy({ email })
  }
}
