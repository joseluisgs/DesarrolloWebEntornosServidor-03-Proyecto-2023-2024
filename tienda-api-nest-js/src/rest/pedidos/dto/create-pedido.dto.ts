import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator'

export class DireccionDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  calle: string

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  numero: string

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  ciudad: string

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  provincia: string

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  pais: string

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  codigoPostal: string
}

export class ClienteDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  nombreCompleto: string

  @IsString()
  @MaxLength(100)
  @IsEmail()
  email: string

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  telefono: string

  @IsNotEmpty()
  direccion: DireccionDto
}

export class LineaPedidoDto {
  @IsNumber()
  @IsNotEmpty()
  idProducto: number

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'El precio debe ser mayor que 0' })
  precioProducto: number

  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'El stock debe ser mayor que 0' })
  cantidad: number

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'El stock debe ser mayor que 0' })
  total: number
}

export class CreatePedidoDto {
  @IsNumber()
  @IsNotEmpty()
  idUsuario: number

  @IsNotEmpty()
  cliente: ClienteDto

  @IsNotEmpty()
  lineasPedido: LineaPedidoDto[]
}
