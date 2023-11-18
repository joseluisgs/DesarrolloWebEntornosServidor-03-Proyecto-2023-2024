import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator'

export class UserSignUpDto {
  @IsNotEmpty({ message: 'Nombre no puede estar vacío' })
  @IsString({ message: 'Nombre no es válido' })
  nombre: string

  @IsNotEmpty({ message: 'Apellidos no puede estar vacío' })
  @IsString({ message: 'Apellidos no es válido' })
  apellidos: string

  @IsNotEmpty({ message: 'Username no puede estar vacío' })
  @IsString({ message: 'Username no es válido' })
  username: string

  @IsEmail({}, { message: 'Email no es válido' })
  @IsNotEmpty({ message: 'Email no puede estar vacío' })
  email: string

  @IsString({ message: 'Password no es válido' })
  @IsNotEmpty({ message: 'Password no puede estar vacío' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'Password no es válido, debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número',
  })
  password: string
}
