import { PartialType } from '@nestjs/mapped-types'
import { CreateProductoDto } from './create-producto.dto'
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateProductoDto extends PartialType(CreateProductoDto) {
  @ApiProperty({
    example: 'Marca Ejemplo',
    description: 'La marca del producto',
  })
  @IsOptional()
  @IsString()
  marca?: string

  @ApiProperty({
    example: 'Modelo Ejemplo',
    description: 'El modelo del producto',
  })
  @IsOptional()
  @IsString()
  modelo?: string

  @ApiProperty({
    example: 'Descripción Ejemplo',
    description: 'La descripción del producto',
  })
  @IsOptional()
  @IsString()
  descripcion?: string

  @ApiProperty({ example: 9.99, description: 'El precio del producto' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  precio?: number

  @ApiProperty({ example: 10, description: 'El stock del producto' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number

  @ApiProperty({
    example: 'imagen.jpg',
    description: 'La URL de la imagen del producto',
  })
  @IsOptional()
  @IsString()
  imagen?: string

  @ApiProperty({
    example: 'Electrónicos',
    description: 'El nombre de la categoría del producto',
  })
  @IsOptional()
  @IsString()
  categoria?: string

  @ApiProperty({
    example: true,
    description: 'Indica si el producto ha sido eliminado',
  })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean
}
