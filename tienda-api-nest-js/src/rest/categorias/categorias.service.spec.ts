import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CategoriasService } from './categorias.service'
import { CategoriaEntity } from './entities/categoria.entity'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'
import { NotFoundException } from '@nestjs/common'
import { CategoriasMapper } from './mappers/categorias.mapper/categorias.mapper'
import { Paginated } from 'nestjs-paginate'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

describe('CategoriasService', () => {
  let service: CategoriasService
  let repo: Repository<CategoriaEntity>
  let mapper: CategoriasMapper
  let cacheManager: Cache

  // Creamos un mock de nuestro mapper de categorías.
  const categoriasMapperMock = {
    toEntity: jest.fn(),
  }

  const cacheManagerMock = {
    get: jest.fn(() => Promise.resolve()),
    set: jest.fn(() => Promise.resolve()),
    store: {
      keys: jest.fn(),
    },
  }

  beforeEach(async () => {
    // Creamos un módulo de prueba de NestJS que nos permitirá crear una instancia de nuestro servicio.
    const module: TestingModule = await Test.createTestingModule({
      // Proporcionamos una lista de dependencias que se inyectarán en nuestro servicio.
      providers: [
        CategoriasService,
        { provide: CategoriasMapper, useValue: categoriasMapperMock },
        {
          provide: getRepositoryToken(CategoriaEntity), // Obtenemos el token de la entidad CategoriaEntity para inyectarlo en el servicio.
          useClass: Repository, // Creamos una instancia de la clase Repository para inyectarla en el servicio
        },
        { provide: CACHE_MANAGER, useValue: cacheManagerMock },
      ],
    }).compile() // Compilamos el módulo de prueba.

    service = module.get<CategoriasService>(CategoriasService) // Obtenemos una instancia de nuestro servicio.
    // getRepositoryToken es una función de NestJS que se utiliza para generar un token de inyección de dependencias para un repositorio de TypeORM.
    repo = module.get<Repository<CategoriaEntity>>(
      getRepositoryToken(CategoriaEntity),
    )
    mapper = module.get<CategoriasMapper>(CategoriasMapper)
    cacheManager = module.get<Cache>(CACHE_MANAGER)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    // Para evitar el problema del linter!!
    const expectPaginatedResult = (result, paginateOptions) => {
      // Expect the result to have the correct itemsPerPage
      expect(result.meta.itemsPerPage).toEqual(paginateOptions.limit)
      // Expect the result to have the correct currentPage
      expect(result.meta.currentPage).toEqual(paginateOptions.page)
      // Expect the result to have the correct totalPages
      expect(result.meta.totalPages).toEqual(1) // You may need to adjust this value based on your test case
      // Expect the result to have the correct current link
      expect(result.links.current).toEqual(
        `categorias?page=${paginateOptions.page}&limit=${paginateOptions.limit}&sortBy=nombre:ASC`,
      )
    }

    it('should return all categories', async () => {
      // Mock the cacheManager.get method to return null

      // Create a mock PaginateQuery object
      const paginateOptions = {
        page: 1,
        limit: 10,
        path: 'categorias',
      }

      // Mock the paginate method to return a Paginated object
      const testCategories = {
        data: [],
        meta: {
          itemsPerPage: 10,
          totalItems: 1,
          currentPage: 1,
          totalPages: 1,
        },
        links: {
          current: 'categorias?page=1&limit=10&sortBy=nombre:ASC',
        },
      } as Paginated<CategoriaEntity>

      jest.spyOn(cacheManager, 'get').mockResolvedValue(Promise.resolve(null))

      // Mock the cacheManager.set method
      jest.spyOn(cacheManager, 'set').mockResolvedValue()

      // Debemos simular la consulta
      const mockQueryBuilder = {
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([testCategories, 1]),
      }

      jest
        .spyOn(repo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)

      // Call the findAll method
      const result = await service.findAll(paginateOptions)
      // console.log(result)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expectPaginatedResult(result, paginateOptions)
      expect(cacheManager.get).toHaveBeenCalled()
      expect(cacheManager.set).toHaveBeenCalled()
    })

    it('should return cached result', async () => {
      // Create a mock PaginateQuery object
      const paginateOptions = {
        page: 1,
        limit: 10,
        path: 'categorias',
      }

      // Mock the paginate method to return a Paginated object
      const testCategories = {
        data: [],
        meta: {
          itemsPerPage: 10,
          totalItems: 1,
          currentPage: 1,
          totalPages: 1,
        },
        links: {
          current: 'categorias?page=1&limit=10&sortBy=nombre:ASC',
        },
      } as Paginated<CategoriaEntity>

      // Mock the cacheManager.get method to return a cached result
      jest.spyOn(cacheManager, 'get').mockResolvedValue(testCategories)

      // Call the findAll method
      const result = await service.findAll(paginateOptions)

      // Expect the cacheManager.get method to be called with the correct key
      expect(cacheManager.get).toHaveBeenCalledWith(
        `all_categories_page_${paginateOptions.page}`,
      )

      // Expect the result to be the cached result
      expect(result).toEqual(testCategories)
    })
  })

  describe('findOne', () => {
    it('should return a single category', async () => {
      const testCategory = new CategoriaEntity()
      jest.spyOn(cacheManager, 'get').mockResolvedValue(Promise.resolve(null))

      jest.spyOn(repo, 'findOneBy').mockResolvedValue(testCategory)

      jest.spyOn(cacheManager, 'set').mockResolvedValue()

      expect(await service.findOne('1')).toEqual(testCategory)
    })

    it('should throw an error if the category does not exist', async () => {
      jest.spyOn(repo, 'findOneBy').mockResolvedValue(null)
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    it('should successfully insert a category', async () => {
      const testCategory = new CategoriaEntity()
      testCategory.nombre = 'test'

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(), // Añade esto
        getOne: jest.fn().mockResolvedValue(null),
      }

      jest
        .spyOn(repo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)
      jest.spyOn(mapper, 'toEntity').mockReturnValue(testCategory)
      jest.spyOn(repo, 'save').mockResolvedValue(testCategory)
      jest.spyOn(service, 'exists').mockResolvedValue(null) // Simula la función 'exists'

      jest.spyOn(cacheManager.store, 'keys').mockResolvedValue([])

      expect(await service.create(new CreateCategoriaDto())).toEqual(
        testCategory,
      )
      expect(mapper.toEntity).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('should call the update method', async () => {
      const testCategory = new CategoriaEntity()
      testCategory.nombre = 'test'

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(testCategory),
      }

      const mockUpdateCategoriaDto = new UpdateCategoriaDto()

      jest
        .spyOn(repo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)
      jest.spyOn(service, 'exists').mockResolvedValue(testCategory) // Simula la función 'exists'
      jest.spyOn(repo, 'findOneBy').mockResolvedValue(testCategory)
      jest.spyOn(mapper, 'toEntity').mockReturnValue(testCategory)
      jest.spyOn(repo, 'save').mockResolvedValue(testCategory)

      const result = await service.update('1', mockUpdateCategoriaDto)

      expect(result).toEqual(testCategory)
    })
  })

  describe('remove', () => {
    it('should call the delete method', async () => {
      const testCategory = new CategoriaEntity()
      jest.spyOn(repo, 'findOneBy').mockResolvedValue(testCategory)
      jest.spyOn(repo, 'remove').mockResolvedValue(testCategory)

      expect(await service.remove('1')).toEqual(testCategory)
    })
  })

  describe('removeSoft', () => {
    it('should call the soft delete method', async () => {
      const testCategory = new CategoriaEntity()
      jest.spyOn(repo, 'findOneBy').mockResolvedValue(testCategory)
      jest.spyOn(repo, 'save').mockResolvedValue(testCategory)

      expect(await service.removeSoft('1')).toEqual(testCategory)
    })
  })
})
