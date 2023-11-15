import { Injectable } from '@nestjs/common'
import { Usuario } from '../entities/user.entity'
import { UserDto } from '../dto/user-response.dto'

@Injectable()
export class UsuariosMapper {
  toResponseDto(user: Usuario): UserDto {
    const userDto = new UserDto()
    userDto.id = user.id
    userDto.nombre = user.nombre
    userDto.apellidos = user.apellidos
    userDto.username = user.username
    userDto.email = user.email
    userDto.createdAt = user.createdAt
    userDto.updatedAt = user.updatedAt
    userDto.isDeleted = user.isDeleted
    userDto.roles = user.roles.map((role) => role.role)
    return userDto
  }
}
