import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { CategoriaEntity } from './entities/categoria.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CategoriasService {
  private readonly logger = new Logger(CategoriasService.name)

  constructor(
    @InjectRepository(CategoriaEntity)
    private readonly categoriaRepository: Repository<CategoriaEntity>,
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
    return 'This action adds a new categoria'
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    this.logger.log(`Update categoria by id:${id} ${updateCategoriaDto}`)
    const categoriaToUpdate = this.findOne(id)
    return `This action updates a #${id} categoria`
  }

  async remove(id: string) {
    this.logger.log(`Remove categoria by id:${id}`)
    const categoriaToRemove = this.findOne(id)
    return `This action removes a #${id} categoria`
  }
}
