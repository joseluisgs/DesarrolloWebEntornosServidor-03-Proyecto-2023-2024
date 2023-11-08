import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CategoriasService } from './categorias.service'
import { CategoriaEntity } from './entities/categoria.entity'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'
import { CategoriasMapper } from './mappers/categorias.mapper/categorias.mapper'
import { NotFoundException } from '@nestjs/common'

describe('CategoriasService', () => {
  let service: CategoriasService
  let repo: Repository<CategoriaEntity>

  beforeEach(async () => {
    // Creamos un módulo de prueba de NestJS que nos permitirá crear una instancia de nuestro servicio.
    const module: TestingModule = await Test.createTestingModule({
      // Proporcionamos una lista de dependencias que se inyectarán en nuestro servicio.
      providers: [
        CategoriasService,
        CategoriasMapper,
        {
          provide: getRepositoryToken(CategoriaEntity), // Obtenemos el token de la entidad CategoriaEntity para inyectarlo en el servicio.
          useClass: Repository, // Creamos una instancia de la clase Repository para inyectarla en el servicio
        },
      ],
    }).compile() // Compilamos el módulo de prueba.

    service = module.get<CategoriasService>(CategoriasService) // Obtenemos una instancia de nuestro servicio.
    // getRepositoryToken es una función de NestJS que se utiliza para generar un token de inyección de dependencias para un repositorio de TypeORM.
    repo = module.get<Repository<CategoriaEntity>>(
      getRepositoryToken(CategoriaEntity),
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return all categories', async () => {
      // Assert that all categories
      const testCategories = [new CategoriaEntity()]
      // Mock the find method
      jest.spyOn(repo, 'find').mockResolvedValue(testCategories)
      // expect that the service will return all categories
      expect(await service.findAll()).toEqual(testCategories)
    })
  })

  describe('findOne', () => {
    it('should return a single category', async () => {
      const testCategory = new CategoriaEntity()
      jest.spyOn(repo, 'findOneBy').mockResolvedValue(testCategory)
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
      jest.spyOn(repo, 'save').mockResolvedValue(testCategory)

      expect(await service.create(new CreateCategoriaDto())).toEqual(
        testCategory,
      )
    })
  })

  describe('update', () => {
    it('should call the update method', async () => {
      const testCategory = new CategoriaEntity()
      jest.spyOn(repo, 'findOneBy').mockResolvedValue(testCategory)
      jest.spyOn(repo, 'save').mockResolvedValue(testCategory)

      expect(await service.update('1', new UpdateCategoriaDto())).toEqual(
        testCategory,
      )
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
