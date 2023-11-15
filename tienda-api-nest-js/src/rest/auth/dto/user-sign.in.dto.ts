import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UserSignInDto {
  @IsEmail({}, { message: 'Email no es válido' })
  @IsNotEmpty({ message: 'Email no puede estar vacío' })
  email: string

  @IsString({ message: 'Password no es válido' })
  @IsNotEmpty({ message: 'Password no puede estar vacío' })
  password: string
}
