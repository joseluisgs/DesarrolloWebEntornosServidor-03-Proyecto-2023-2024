import { Injectable } from '@nestjs/common'
import { ProductoEntity } from '../entities/producto.entity'
import { plainToClass } from 'class-transformer'
import { CreateProductoDto } from '../dto/create-producto.dto'
import { CategoriaEntity } from '../../categorias/entities/categoria.entity'
import { v4 as uuidv4 } from 'uuid'
import { ResponseProductoDto } from '../dto/response-producto.dto'
import { ProductoNotificacionResponse } from '../../../websockets/notifications/dto/producto-notificacion.dto'

@Injectable()
export class ProductosMapper {
  toEntity(
    createProductoDto: CreateProductoDto,
    categoria: CategoriaEntity,
  ): ProductoEntity {
    const productoEntity = plainToClass(ProductoEntity, createProductoDto)
    productoEntity.categoria = categoria
    productoEntity.uuid = uuidv4()
    return productoEntity
  }

  toResponseDto(productoEntity: ProductoEntity): ResponseProductoDto {
    const dto = plainToClass(ResponseProductoDto, productoEntity)
    if (productoEntity.categoria && productoEntity.categoria.nombre) {
      dto.categoria = productoEntity.categoria.nombre
    } else {
      dto.categoria = null
    }
    return dto
  }

  toNotificacionDto(
    productoEntity: ProductoEntity,
  ): ProductoNotificacionResponse {
    const dto = plainToClass(ProductoNotificacionResponse, productoEntity)
    if (productoEntity.categoria && productoEntity.categoria.nombre) {
      dto.categoria = productoEntity.categoria.nombre
    } else {
      dto.categoria = null
    }
    return dto
  }
}
