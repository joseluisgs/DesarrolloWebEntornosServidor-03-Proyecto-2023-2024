import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'
import { IsOptional } from 'class-validator'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  nombre: string
  @IsOptional()
  apellidos: string
  @IsOptional()
  username: string
  @IsOptional()
  email: string
  @IsOptional()
  roles: string[]
  @IsOptional()
  password: string
  @IsOptional()
  isDeleted: boolean
}
