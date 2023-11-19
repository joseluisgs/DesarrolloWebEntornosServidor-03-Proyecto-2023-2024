import { ApiProperty } from '@nestjs/swagger'

export class ResponseProductoDto {
  @ApiProperty({ example: 1, description: 'ID del producto' })
  id: number

  @ApiProperty({ example: 'Nike', description: 'Marca del producto' })
  marca: string

  @ApiProperty({ example: 'Air Max 90', description: 'Modelo del producto' })
  modelo: string

  @ApiProperty({
    example: 'Zapatillas deportivas',
    description: 'Descripción del producto',
  })
  descripcion: string

  @ApiProperty({ example: 99.99, description: 'Precio del producto' })
  precio: number

  @ApiProperty({ example: 10, description: 'Cantidad disponible en stock' })
  stock: number

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'URL de la imagen del producto',
  })
  imagen: string

  @ApiProperty({ example: 'abc123', description: 'UUID único del producto' })
  uuid: string

  @ApiProperty({
    example: '2023-09-01T12:34:56Z',
    description: 'Fecha y hora de creación del producto',
  })
  createdAt: Date

  @ApiProperty({
    example: '2023-09-02T10:20:30Z',
    description: 'Fecha y hora de actualización del producto',
  })
  updatedAt: Date

  @ApiProperty({
    example: false,
    description: 'Indica si el producto ha sido eliminado',
  })
  isDeleted: boolean

  @ApiProperty({ example: 'Calzado', description: 'Categoría del producto' })
  categoria: string
}
