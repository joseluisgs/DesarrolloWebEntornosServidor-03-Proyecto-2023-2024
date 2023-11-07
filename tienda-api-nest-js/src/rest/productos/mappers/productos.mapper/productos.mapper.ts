import { Injectable } from '@nestjs/common'
import { ProductoEntity } from '../../entities/producto.entity'
import { plainToClass } from 'class-transformer'
import { CreateProductoDto } from '../../dto/create-producto.dto'
import { CategoriaEntity } from '../../../categorias/entities/categoria.entity'
import { v4 as uuidv4 } from 'uuid'
import { ResponseProductoDto } from '../../dto/response-producto.dto'

@Injectable()
export class ProductosMapper {
  toEntity(
    createProductoDto: CreateProductoDto,
    categoria: CategoriaEntity,
  ): ProductoEntity {
    const productoEntity = plainToClass(ProductoEntity, createProductoDto)
    return { ...productoEntity, categoria, uuid: uuidv4() }
  }

  toResponseDto(productoEntity: ProductoEntity): ResponseProductoDto {
    const dto = plainToClass(ResponseProductoDto, productoEntity)
    dto.categoria = productoEntity.categoria.nombre
    return dto
  }
}
