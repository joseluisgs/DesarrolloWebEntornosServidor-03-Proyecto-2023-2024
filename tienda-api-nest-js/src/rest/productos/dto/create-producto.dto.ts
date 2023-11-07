import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator'

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  marca: string

  @IsString()
  @IsNotEmpty()
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  modelo: string

  @IsString()
  @IsNotEmpty()
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres' })
  descripcion: string

  @IsNumber()
  @Min(0, { message: 'El precio debe ser mayor que 0' })
  precio: number

  @IsNumber()
  @Min(0, { message: 'El stock debe ser mayor que 0' })
  stock: number

  @IsOptional()
  @IsString()
  imagen?: string

  @IsString()
  @IsNotEmpty()
  categoria: string // No es el id, si no el nombre de la categoria
}
