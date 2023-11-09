import { PartialType } from '@nestjs/mapped-types'
import { CreateProductoDto } from './create-producto.dto'
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator'

export class UpdateProductoDto extends PartialType(CreateProductoDto) {
  @IsOptional()
  @IsString()
  marca?: string

  @IsOptional()
  @IsString()
  modelo?: string

  @IsOptional()
  @IsString()
  descripcion?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number

  @IsOptional()
  @IsString()
  imagen?: string

  @IsOptional()
  @IsString()
  categoria?: string // No es el id, si no el nombre de la categoria

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean
}
