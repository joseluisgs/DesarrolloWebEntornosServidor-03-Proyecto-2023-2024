import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { CategoriaEntity } from './entities/categoria.entity'
import { Repository } from 'typeorm'
import { CategoriasMapper } from './mappers/categorias.mapper/categorias.mapper'
import { v4 as uuidv4 } from 'uuid'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate'
import { hash } from 'typeorm/util/StringUtils'

@Injectable()
export class CategoriasService {
  private readonly logger = new Logger(CategoriasService.name)

  constructor(
    @InjectRepository(CategoriaEntity)
    private readonly categoriaRepository: Repository<CategoriaEntity>,
    private readonly categoriasMapper: CategoriasMapper,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(query: PaginateQuery) {
    this.logger.log('Find all categorias')
    // cache
    const cache = await this.cacheManager.get(
      `all_categories_page_${hash(JSON.stringify(query))}`,
    )
    if (cache) {
      this.logger.log('Cache hit')
      return cache
    }
    const res = await paginate(query, this.categoriaRepository, {
      sortableColumns: ['nombre'],
      defaultSortBy: [['nombre', 'ASC']],
      searchableColumns: ['nombre'],
      filterableColumns: {
        nombre: [FilterOperator.EQ, FilterSuffix.NOT],
        isDeleted: [FilterOperator.EQ, FilterSuffix.NOT],
      },
      // select: ['id', 'nombre', 'isDeleted', 'createdAt', 'updatedAt'],
    })
    //console.log(res)
    await this.cacheManager.set(
      `all_categories_page_${hash(JSON.stringify(query))}`,
      res,
      60,
    )
    return res
  }

  async findOne(id: string): Promise<CategoriaEntity> {
    this.logger.log(`Find one categoria by id:${id}`)
    // cache
    const cache: CategoriaEntity = await this.cacheManager.get(`category_${id}`)
    if (cache) {
      this.logger.log('Cache hit')
      return cache
    }
    const categoriaToFound = await this.categoriaRepository.findOneBy({ id })
    if (!categoriaToFound) {
      this.logger.log(`Categoria with id:${id} not found`)
      throw new NotFoundException(`Categoria con id ${id} no encontrada`)
    }
    // Guardamos en cache
    await this.cacheManager.set(`category_${id}`, categoriaToFound, 60)
    return categoriaToFound
  }

  async create(
    createCategoriaDto: CreateCategoriaDto,
  ): Promise<CategoriaEntity> {
    this.logger.log(`Create categoria ${createCategoriaDto}`)
    // Añadimos un id único a la categoría, porque no lo hemos hecho en el mapper
    const categoriaToCreate = this.categoriasMapper.toEntity(createCategoriaDto)
    // Existe otra categoria?
    const categoria = await this.exists(categoriaToCreate.nombre)

    if (categoria) {
      this.logger.log(`Categoria with name:${categoria.nombre} already exists`)
      throw new BadRequestException(
        `La categoria con nombre ${categoria.nombre} ya existe`,
      )
    }

    // Añadimos los metadatos de uuid, createdAt y updatedAt
    const res = await this.categoriaRepository.save({
      ...categoriaToCreate,
      id: uuidv4(),
    })
    // Invalidamos la cache
    await this.invalidateCacheKey('all_categories')
    return res
  }

  async update(
    id: string,
    updateCategoriaDto: UpdateCategoriaDto,
  ): Promise<CategoriaEntity> {
    this.logger.log(`Update categoria by id:${id} - ${updateCategoriaDto}`)
    const categoryToUpdated = await this.findOne(id)

    // Existe otra categoria y si existe soy yo?
    // actualizamos el nombre?
    if (updateCategoriaDto.nombre) {
      const categoria = await this.exists(updateCategoriaDto.nombre)
      if (categoria && categoria.id !== categoryToUpdated.id) {
        this.logger.log(
          `Categoria with name:${categoria.nombre} already exists`,
        )
        throw new BadRequestException(
          `La categoria con nombre ${categoria.nombre} ya existe`,
        )
      }
    }

    const res = await this.categoriaRepository.save({
      ...categoryToUpdated,
      ...updateCategoriaDto,
    })
    // Invalidamos la cache
    await this.invalidateCacheKey(`category_${id}`)
    await this.invalidateCacheKey('all_categories')
    return res
  }

  async remove(id: string): Promise<CategoriaEntity> {
    this.logger.log(`Remove categoria by id:${id}`)
    const categoriaToRemove = await this.findOne(id)
    const res = await this.categoriaRepository.remove(categoriaToRemove)
    // Invalidamos la cache
    await this.invalidateCacheKey(`category_${id}`)
    await this.invalidateCacheKey('all_categories')
    return res
  }

  async removeSoft(id: string): Promise<CategoriaEntity> {
    this.logger.log(`Remove categoria soft by id:${id}`)
    const categoriaToRemove = await this.findOne(id)
    const res = await this.categoriaRepository.save({
      ...categoriaToRemove,
      updatedAt: new Date(),
      isDeleted: true,
    })
    // Invalidamos la cache
    await this.invalidateCacheKey(`category_${id}`)
    await this.invalidateCacheKey('all_categories')
    return res
  }

  public async exists(nombreCategoria: string): Promise<CategoriaEntity> {
    // Cache
    const cache: CategoriaEntity = await this.cacheManager.get(
      `category_name_${nombreCategoria}`,
    )
    if (cache) {
      this.logger.log('Cache hit')
      return cache
    }
    // Comprobamos si existe la categoria
    // No uso el fin por la minúscula porque no es case sensitive
    const categoria = await this.categoriaRepository
      .createQueryBuilder()
      .where('LOWER(nombre) = LOWER(:nombre)', {
        nombre: nombreCategoria.toLowerCase(),
      })
      .getOne()
    // Guardamos en caché
    await this.cacheManager.set(
      `category_name_${nombreCategoria}`,
      categoria,
      60,
    )
  }

  async invalidateCacheKey(keyPattern: string): Promise<void> {
    const cacheKeys = await this.cacheManager.store.keys()
    const keysToDelete = cacheKeys.filter((key) => key.startsWith(keyPattern))
    const promises = keysToDelete.map((key) => this.cacheManager.del(key))
    await Promise.all(promises)
  }
}
