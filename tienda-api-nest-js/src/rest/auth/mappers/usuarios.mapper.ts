import { Injectable } from '@nestjs/common'
import { UserSignUpDto } from '../dto/user-sign.up.dto'
import { Role } from '../../users/entities/user-role.entity'
import { CreateUserDto } from '../../users/dto/create-user.dto'

@Injectable()
export class AuthMapper {
  toCreateDto(userSignUpDto: UserSignUpDto): CreateUserDto {
    const userCreateDto = new CreateUserDto()
    userCreateDto.nombre = userSignUpDto.nombre
    userCreateDto.apellidos = userSignUpDto.apellidos
    userCreateDto.username = userSignUpDto.username
    userCreateDto.email = userSignUpDto.email
    userCreateDto.password = userSignUpDto.password
    userCreateDto.roles = [Role.USER]
    return userCreateDto
  }
}
