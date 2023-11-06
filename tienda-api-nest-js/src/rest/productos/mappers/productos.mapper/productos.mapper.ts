import { Injectable } from '@nestjs/common'
import { ProductoEntity } from '../../entities/producto.entity'
import { plainToClass } from 'class-transformer'
import { CreateProductoDto } from '../../dto/create-producto.dto'
import { UpdateProductoDto } from '../../dto/update-producto.dto'

@Injectable()
export class ProductosMapper {
  toEntity(
    createProductoDto: CreateProductoDto,
    categoriaId: string,
  ): ProductoEntity {
    const productoEntity = plainToClass(ProductoEntity, createProductoDto)
    return { ...productoEntity, categoriaId: categoriaId }
  }

  toDto(productoEntity: ProductoEntity): CreateProductoDto {
    return plainToClass(CreateProductoDto, productoEntity)
  }

  toUpdateDto(productoEntity: ProductoEntity): UpdateProductoDto {
    return plainToClass(UpdateProductoDto, productoEntity)
  }
}
