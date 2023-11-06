import { Injectable } from '@nestjs/common'
import { CreateCategoriaDto } from '../../dto/create-categoria.dto'
import { CategoriaEntity } from '../../entities/categoria.entity'
import { plainToClass } from 'class-transformer'
import { v4 as uuidv4 } from 'uuid'
import { UpdateCategoriaDto } from '../../dto/update-categoria.dto'

@Injectable()
export class CategoriasMapper {
  toEntity(
    createCategoriaDto: CreateCategoriaDto | UpdateCategoriaDto,
  ): CategoriaEntity {
    const entidad = plainToClass(CategoriaEntity, createCategoriaDto)
    entidad.id = uuidv4()
    return entidad
  }
}
