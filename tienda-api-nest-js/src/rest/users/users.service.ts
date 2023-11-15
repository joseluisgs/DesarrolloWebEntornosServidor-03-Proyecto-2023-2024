import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Usuario } from './entities/user.entity'
import { UsuariosMapper } from './mappers/usuarios.mapper'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)

  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    private readonly usuariosMapper: UsuariosMapper,
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
}
