import { IsNotEmpty, IsString } from 'class-validator'

export class UserSignInDto {
  @IsNotEmpty({ message: 'Username no puede estar vacío' })
  username: string

  @IsString({ message: 'Password no es válido' })
  @IsNotEmpty({ message: 'Password no puede estar vacío' })
  password: string
}
