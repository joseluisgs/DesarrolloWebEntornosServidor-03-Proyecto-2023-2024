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
  @Length(1, 100)
  marca: string

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  modelo: string

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  descripcion: string

  @IsNumber()
  @Min(0)
  precio: number

  @IsNumber()
  @Min(0)
  stock: number

  @IsOptional()
  @IsString()
  imagen?: string

  @IsString()
  @IsNotEmpty()
  categoria: string // No es el id, si no el nombre de la categoria
}
