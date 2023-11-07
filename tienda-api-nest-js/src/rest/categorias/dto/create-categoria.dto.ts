import { IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  nombre: string
}
