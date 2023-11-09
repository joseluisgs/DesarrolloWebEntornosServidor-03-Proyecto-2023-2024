import { Injectable } from '@nestjs/common'
import { CreateCategoriaDto } from '../../dto/create-categoria.dto'
import { CategoriaEntity } from '../../entities/categoria.entity'
import { plainToClass } from 'class-transformer'
import { UpdateCategoriaDto } from '../../dto/update-categoria.dto'

@Injectable()
export class CategoriasMapper {
  toEntity(
    createCategoriaDto: CreateCategoriaDto | UpdateCategoriaDto,
  ): CategoriaEntity {
    return plainToClass(CategoriaEntity, createCategoriaDto)
  }
}
