import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UserSignInDto {
  @ApiProperty({ example: 'john_doe', description: 'Nombre de usuario' })
  @IsNotEmpty({ message: 'Username no puede estar vacío' })
  username: string

  @ApiProperty({ example: 'password123', description: 'Contraseña' })
  @IsString({ message: 'Password no es válido' })
  @IsNotEmpty({ message: 'Password no puede estar vacío' })
  password: string
}
