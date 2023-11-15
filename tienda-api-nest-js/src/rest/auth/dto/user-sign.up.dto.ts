import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator'

export class UserSignUpDto {
  @IsNotEmpty({ message: 'Username no puede estar vacío' })
  @IsString({ message: 'Username no es válido' })
  username: string

  @IsEmail({}, { message: 'Email no es válido' })
  @IsNotEmpty({ message: 'Email no puede estar vacío' })
  email: string

  @IsString({ message: 'Password no es válido' })
  @IsNotEmpty({ message: 'Password no puede estar vacío' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message: 'Password no es válido',
  })
  password: string
}
