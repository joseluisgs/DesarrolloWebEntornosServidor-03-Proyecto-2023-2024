import { Test, TestingModule } from '@nestjs/testing'
import { ProductosService } from './productos.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ProductoEntity } from './entities/producto.entity'
import { CategoriaEntity } from '../categorias/entities/categoria.entity'
import { ProductosMapper } from './mappers/productos.mapper/productos.mapper'
import { Repository } from 'typeorm'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { ResponseProductoDto } from './dto/response-producto.dto'
import { CreateProductoDto } from './dto/create-producto.dto'
import { UpdateProductoDto } from './dto/update-producto.dto'
import { StorageService } from '../storage/storage.service'

describe('ProductosService', () => {
  let service: ProductosService // servicio
  let productoRepository: Repository<ProductoEntity> // repositorio
  let categoriaRepository: Repository<CategoriaEntity> // repositorio
  let mapper: ProductosMapper // mapper
  let storageService: StorageService // servicio de almacenamiento

  const productosMapperMock = {
    toEntity: jest.fn(),
    toResponseDto: jest.fn(),
  }

  const storageServiceMock = {
    removeFile: jest.fn(),
    getFileNameWithouUrl: jest.fn(),
  }

  // Creamos un módulo de prueba de NestJS que nos permitirá crear una instancia de nuestro servicio.
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // Proporcionamos una lista de dependencias que se inyectarán en nuestro servicio.
      providers: [
        // Inyectamos al servicio los repositorios y el mapper
        ProductosService,
        { provide: getRepositoryToken(ProductoEntity), useClass: Repository },
        { provide: getRepositoryToken(CategoriaEntity), useClass: Repository },
        { provide: ProductosMapper, useValue: productosMapperMock },
        { provide: StorageService, useValue: storageServiceMock },
      ],
    }).compile()

    service = module.get<ProductosService>(ProductosService) // Obtenemos una instancia de nuestro servicio.
    productoRepository = module.get(getRepositoryToken(ProductoEntity)) // Obtenemos una instancia del repositorio de productos
    categoriaRepository = module.get(getRepositoryToken(CategoriaEntity)) // Obtenemos una instancia del repositorio de categorías
    mapper = module.get<ProductosMapper>(ProductosMapper) // Obtenemos una instancia del mapper
    storageService = module.get<StorageService>(StorageService) // Obtenemos una instancia del servicio de almacenamiento
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return an array of productos', async () => {
      const result: ResponseProductoDto[] = []
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(result),
      }

      jest
        .spyOn(productoRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)

      jest.spyOn(mapper, 'toResponseDto').mockReturnValue(result[0])

      expect(await service.findAll()).toEqual(result)
    })
  })

  describe('findOne', () => {
    it('should retrieve a producto by id', async () => {
      const result = new ProductoEntity()
      const resultDto = new ResponseProductoDto()
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(), // Añade esto
        getOne: jest.fn().mockResolvedValue(result),
      }

      jest
        .spyOn(productoRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)

      jest.spyOn(mapper, 'toResponseDto').mockReturnValue(resultDto)

      expect(await service.findOne(1)).toEqual(resultDto)
      expect(mapper.toResponseDto).toHaveBeenCalledTimes(1)
    })

    it('should throw an error if producto does not exist', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }

      jest
        .spyOn(productoRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    it('should create a new producto', async () => {
      const createProductoDto = new CreateProductoDto()

      const mockCategoriaEntity = new CategoriaEntity()
      const mockProductoEntity = new ProductoEntity()
      const mockResponseProductoDto = new ResponseProductoDto()

      jest
        .spyOn(service, 'checkCategoria')
        .mockResolvedValue(mockCategoriaEntity)

      jest.spyOn(mapper, 'toEntity').mockReturnValue(mockProductoEntity)

      jest
        .spyOn(productoRepository, 'save')
        .mockResolvedValue(mockProductoEntity)

      jest
        .spyOn(mapper, 'toResponseDto')
        .mockReturnValue(mockResponseProductoDto)

      expect(await service.create(createProductoDto)).toEqual(
        mockResponseProductoDto,
      )
      expect(mapper.toEntity).toHaveBeenCalled()
      expect(productoRepository.save).toHaveBeenCalled()
      expect(service.checkCategoria).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('should update a producto', async () => {
      const updateProductoDto = new UpdateProductoDto()

      const mockProductoEntity = new ProductoEntity()
      const mockResponseProductoDto = new ResponseProductoDto()

      jest.spyOn(service, 'exists').mockResolvedValue(mockProductoEntity)

      jest
        .spyOn(productoRepository, 'save')
        .mockResolvedValue(mockProductoEntity)

      jest
        .spyOn(mapper, 'toResponseDto')
        .mockReturnValue(mockResponseProductoDto)

      expect(await service.update(1, updateProductoDto)).toEqual(
        mockResponseProductoDto,
      )
    })
  })

  describe('remove', () => {
    it('should remove a producto', async () => {
      const mockProductoEntity = new ProductoEntity()
      const mockResponseProductoDto = new ResponseProductoDto()

      jest.spyOn(service, 'exists').mockResolvedValue(mockProductoEntity)

      jest
        .spyOn(productoRepository, 'remove')
        .mockResolvedValue(mockProductoEntity)

      jest
        .spyOn(mapper, 'toResponseDto')
        .mockReturnValue(mockResponseProductoDto)

      expect(await service.remove(1)).toEqual(mockResponseProductoDto)
    })
  })

  describe('removeSoft', () => {
    it('should soft remove a producto', async () => {
      const mockProductoEntity = new ProductoEntity()
      const mockResponseProductoDto = new ResponseProductoDto()

      jest.spyOn(service, 'exists').mockResolvedValue(mockProductoEntity)

      jest
        .spyOn(productoRepository, 'save')
        .mockResolvedValue(mockProductoEntity)

      jest
        .spyOn(mapper, 'toResponseDto')
        .mockReturnValue(mockResponseProductoDto)

      expect(await service.removeSoft(1)).toEqual(mockResponseProductoDto)
    })
  })

  describe('exists', () => {
    const result = new ProductoEntity()
    it('should return true if product exists', async () => {
      const id = 1
      jest
        .spyOn(productoRepository, 'findOneBy')
        .mockResolvedValue(new ProductoEntity())

      expect(await service.exists(id)).toEqual(result)
    })

    it('should return false if product does not exist', async () => {
      const id = 1
      jest.spyOn(productoRepository, 'findOneBy').mockResolvedValue(undefined)

      await expect(service.exists(id)).rejects.toThrow(NotFoundException)
    })
  })

  describe('checkCategoria', () => {
    it('should return true if category exists', async () => {
      const categoria = new CategoriaEntity()
      const categoriaNombre = 'some-category'

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(), // Añade esto
        getOne: jest.fn().mockResolvedValue(categoria),
      }

      jest
        .spyOn(categoriaRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)

      expect(await service.checkCategoria(categoriaNombre)).toBe(categoria)
    })

    it('should return false if category does not exist', async () => {
      const categoriaNombre = 'some-category'

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(), // Añade esto
        getOne: jest.fn().mockResolvedValue(undefined),
      }

      jest
        .spyOn(categoriaRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)

      await expect(service.checkCategoria(categoriaNombre)).rejects.toThrow(
        BadRequestException,
      )
    })
  })

  describe('updateImage', () => {
    it('should update a producto image', async () => {
      const mockRequest = {
        protocol: 'http',
        get: () => 'localhost',
      }
      const mockFile = {
        filename: 'new_image',
      }

      const mockProductoEntity = new ProductoEntity()
      const mockResponseProductoDto = new ResponseProductoDto()

      jest.spyOn(service, 'exists').mockResolvedValue(mockProductoEntity)

      jest
        .spyOn(productoRepository, 'save')
        .mockResolvedValue(mockProductoEntity)

      jest
        .spyOn(mapper, 'toResponseDto')
        .mockReturnValue(mockResponseProductoDto)

      expect(
        await service.updateImage(1, mockFile as any, mockRequest as any, true),
      ).toEqual(mockResponseProductoDto)

      expect(storageService.removeFile).toHaveBeenCalled()
      expect(storageService.getFileNameWithouUrl).toHaveBeenCalled()
    })
  })
})
