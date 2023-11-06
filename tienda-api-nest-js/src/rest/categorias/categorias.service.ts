import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { CategoriaEntity } from './entities/categoria.entity'
import { Repository } from 'typeorm'
import { CategoriasMapper } from './mappers/categorias.mapper/categorias.mapper'

@Injectable()
export class CategoriasService {
  private readonly logger = new Logger(CategoriasService.name)

  constructor(
    @InjectRepository(CategoriaEntity)
    private readonly categoriaRepository: Repository<CategoriaEntity>,
    private readonly categoriasMapper: CategoriasMapper,
  ) {}

  async findAll() {
    this.logger.log('Find all categorias')
    return await this.categoriaRepository.find()
  }

  async findOne(id: string) {
    this.logger.log(`Find one categoria by id:${id}`)
    const categoriaToFound = await this.categoriaRepository.findOneBy({ id })
    if (!categoriaToFound) {
      this.logger.log(`Categoria with id:${id} not found`)
      throw new NotFoundException(`Categoria con id:${id} no encontrada`)
    }
    return categoriaToFound
  }

  async create(createCategoriaDto: CreateCategoriaDto) {
    this.logger.log(`Create categoria ${createCategoriaDto}`)
    // Añadimos un id único a la categoría, porque no lo hemos hecho en el mapper
    return await this.categoriaRepository.save(
      this.categoriasMapper.toEntity(createCategoriaDto),
    )
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    this.logger.log(`Update categoria by id:${id} - ${updateCategoriaDto}`)
    const myCategory = await this.findOne(id)
    const categoryToUpdated = { ...myCategory, ...updateCategoriaDto }
    return await this.categoriaRepository.save(categoryToUpdated)
  }

  async remove(id: string) {
    this.logger.log(`Remove categoria by id:${id}`)
    const categoriaToRemove = await this.findOne(id)
    return await this.categoriaRepository.remove(categoriaToRemove)
  }
}
