import { CategoriasController } from './categorias.controller'
import { CategoriasService } from './categorias.service'
import { Test, TestingModule } from '@nestjs/testing'
import { CategoriaEntity } from './entities/categoria.entity'
import { NotFoundException } from '@nestjs/common'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'
import { CreateCategoriaDto } from './dto/create-categoria.dto'

describe('CategoriasController', () => {
  let controller: CategoriasController
  let service: CategoriasService

  // Mi mock de servicio de categorias tendrá los siguientes métodos
  const mockCategoriaService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    removeSoft: jest.fn(),
  }

  beforeEach(async () => {
    // Creamos un módulo de prueba de NestJS que nos permitirá crear una instancia de nuestro controlador.
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriasController],
      providers: [
        { provide: CategoriasService, useValue: mockCategoriaService },
      ],
    }).compile()

    controller = module.get<CategoriasController>(CategoriasController)
    service = module.get<CategoriasService>(CategoriasService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('findAll', () => {
    it('should get all categorias', async () => {
      const mockResult: Array<CategoriaEntity> = []
      jest.spyOn(service, 'findAll').mockResolvedValue(mockResult)
      const result = await controller.findAll()
      expect(service.findAll).toHaveBeenCalled()
      expect(result).toBeInstanceOf(Array)
    })
  })

  describe('findOne', () => {
    it('should get one categoria', async () => {
      const id = 'uuid'
      const mockResult: CategoriaEntity = new CategoriaEntity()

      jest.spyOn(service, 'findOne').mockResolvedValue(mockResult)
      await controller.findOne(id)
      expect(service.findOne).toHaveBeenCalledWith(id)
      expect(mockResult).toBeInstanceOf(CategoriaEntity)
    })

    it('should throw NotFoundException if categoria does not exist', async () => {
      const id = 'a uuid'
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException())
      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    it('should create a categoria', async () => {
      const dto: CreateCategoriaDto = {
        nombre: 'test',
      }
      const mockResult: CategoriaEntity = new CategoriaEntity()
      jest.spyOn(service, 'create').mockResolvedValue(mockResult)
      await controller.create(dto)
      expect(service.create).toHaveBeenCalledWith(dto)
    })
  })

  describe('update', () => {
    it('should update a categoria', async () => {
      const id = 'a uuid'
      const dto: UpdateCategoriaDto = {
        nombre: 'test',
        isDeleted: true,
      }
      const mockResult: CategoriaEntity = new CategoriaEntity()
      jest.spyOn(service, 'update').mockResolvedValue(mockResult)
      await controller.update(id, dto)
      expect(service.update).toHaveBeenCalledWith(id, dto)
      expect(mockResult).toBeInstanceOf(CategoriaEntity)
    })

    it('should throw NotFoundException if categoria does not exist', async () => {
      const id = 'a uuid'
      const dto: UpdateCategoriaDto = {}
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException())
      await expect(controller.update(id, dto)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('remove', () => {
    it('should remove a categoria', async () => {
      const id = 'a uuid'
      const mockResult: CategoriaEntity = new CategoriaEntity()
      jest.spyOn(service, 'removeSoft').mockResolvedValue(mockResult)
      await controller.remove(id)
      expect(service.removeSoft).toHaveBeenCalledWith(id)
    })

    it('should throw NotFoundException if categoria does not exist', async () => {
      const id = 'a uuid'
      jest
        .spyOn(service, 'removeSoft')
        .mockRejectedValue(new NotFoundException())
      await expect(controller.remove(id)).rejects.toThrow(NotFoundException)
    })
  })
})
