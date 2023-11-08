import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { CategoriaEntity } from './entities/categoria.entity'
import { Repository } from 'typeorm'
import { CategoriasMapper } from './mappers/categorias.mapper/categorias.mapper'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class CategoriasService {
  private readonly logger = new Logger(CategoriasService.name)

  constructor(
    @InjectRepository(CategoriaEntity)
    private readonly categoriaRepository: Repository<CategoriaEntity>,
    private readonly categoriasMapper: CategoriasMapper,
  ) {}

  async findAll(): Promise<CategoriaEntity[]> {
    this.logger.log('Find all categorias')
    return await this.categoriaRepository.find()
  }

  async findOne(id: string): Promise<CategoriaEntity> {
    this.logger.log(`Find one categoria by id:${id}`)
    const categoriaToFound = await this.categoriaRepository.findOneBy({ id })
    if (!categoriaToFound) {
      this.logger.log(`Categoria with id:${id} not found`)
      throw new NotFoundException(`Categoria con id ${id} no encontrada`)
    }
    return categoriaToFound
  }

  async create(
    createCategoriaDto: CreateCategoriaDto,
  ): Promise<CategoriaEntity> {
    this.logger.log(`Create categoria ${createCategoriaDto}`)
    // Añadimos un id único a la categoría, porque no lo hemos hecho en el mapper
    const categoriaToCreate = this.categoriasMapper.toEntity(createCategoriaDto)
    // Añadimos los metadatos de uuid, createdAt y updatedAt
    return await this.categoriaRepository.save({
      ...categoriaToCreate,
      id: uuidv4(),
    })
  }

  async update(
    id: string,
    updateCategoriaDto: UpdateCategoriaDto,
  ): Promise<CategoriaEntity> {
    this.logger.log(`Update categoria by id:${id} - ${updateCategoriaDto}`)
    const categoryToUpdated = await this.findOne(id)
    return await this.categoriaRepository.save({
      ...categoryToUpdated,
      ...updateCategoriaDto,
      //updatedAt: new Date(),
    })
  }

  async remove(id: string): Promise<CategoriaEntity> {
    this.logger.log(`Remove categoria by id:${id}`)
    const categoriaToRemove = await this.findOne(id)
    return await this.categoriaRepository.remove(categoriaToRemove)
  }

  async removeSoft(id: string): Promise<CategoriaEntity> {
    this.logger.log(`Remove categoria soft by id:${id}`)
    const categoriaToRemove = await this.findOne(id)
    return await this.categoriaRepository.save({
      ...categoriaToRemove,
      updatedAt: new Date(),
      isDeleted: true,
    })
  }
}
