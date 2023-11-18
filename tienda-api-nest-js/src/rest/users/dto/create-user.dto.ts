import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  Matches,
} from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nombre no puede estar vacío' })
  nombre: string
  @IsNotEmpty({ message: 'Apellidos no puede estar vacío' })
  apellidos: string
  @IsNotEmpty({ message: 'Username no puede estar vacío' })
  username: string
  @IsEmail({}, { message: 'Email debe ser válido' })
  @IsNotEmpty({ message: 'Email no puede estar vacío' })
  email: string
  @IsArray({ message: 'Roles debe ser un array' })
  @ArrayNotEmpty({ message: 'Roles no puede estar vacío' })
  roles: string[]
  @IsNotEmpty({ message: 'Password no puede estar vacío' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'Password no es válido, debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número',
  })
  password: string
}
