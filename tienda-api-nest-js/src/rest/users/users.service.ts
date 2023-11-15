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

  private async findByEmail(email: string) {
    this.logger.log(`findByEmail: ${email}`)
    return await this.usuariosRepository.findOneBy({ email })
  }
}
