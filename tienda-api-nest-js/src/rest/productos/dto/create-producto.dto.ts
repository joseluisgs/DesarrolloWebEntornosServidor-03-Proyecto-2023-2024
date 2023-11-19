import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateProductoDto {
  @ApiProperty({
    example: 'Nike',
    description: 'La marca del producto',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  marca: string

  @ApiProperty({
    example: 'Air Max',
    description: 'El modelo del producto',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100, { message: 'El nombre debe tener entre 3 y 100 caracteres' })
  modelo: string

  @ApiProperty({
    example: 'Zapatillas deportivas',
    description: 'La descripción del producto',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100, { message: 'El nombre debe tener entre 1 y 100 caracteres' })
  descripcion: string

  @ApiProperty({
    example: 99.99,
    description: 'El precio del producto',
    minimum: 0,
  })
  @IsNumber()
  @Min(0, { message: 'El precio debe ser mayor que 0' })
  precio: number

  @ApiProperty({
    example: 10,
    description: 'El stock del producto',
    minimum: 0,
  })
  @IsNumber()
  @Min(0, { message: 'El stock debe ser mayor que 0' })
  stock: number

  @ApiProperty({
    example: 'https://example.com/imagen.jpg',
    description: 'La URL de la imagen del producto',
    required: false,
  })
  @IsOptional()
  @IsString()
  imagen?: string

  @ApiProperty({
    example: 'Calzado',
    description: 'La categoría del producto',
  })
  @IsString()
  @IsNotEmpty()
  categoria: string // No es el id, si no el nombre de la categoria
}
