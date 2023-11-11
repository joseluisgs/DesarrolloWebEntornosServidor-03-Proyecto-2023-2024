import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { UpdateCategoriaDto } from '../categorias/dto/update-categoria.dto'
import { ProductosController } from './productos.controller'
import { ProductosService } from './productos.service'
import { ResponseProductoDto } from './dto/response-producto.dto'
import { CreateProductoDto } from './dto/create-producto.dto'
import { UpdateProductoDto } from './dto/update-producto.dto'
import { Request } from 'express'
import { Paginated } from 'nestjs-paginate'
import { CacheModule } from '@nestjs/cache-manager'

describe('ProductoController', () => {
  let controller: ProductosController
  let service: ProductosService

  const productosServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    removeSoft: jest.fn(),
    updateImage: jest.fn(),
  }

  // Creamos el mock del servicio con los métodos que vamos a utilizar en el controlador
  beforeEach(async () => {
    // Creamos un módulo de prueba de NestJS que nos permitirá crear una instancia de nuestro controlador.
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()], // importamos el módulo de caché, lo necesita el controlador (interceptores y anotaciones)
      controllers: [ProductosController],
      providers: [
        { provide: ProductosService, useValue: productosServiceMock },
      ],
    }).compile()

    controller = module.get<ProductosController>(ProductosController)
    service = module.get<ProductosService>(ProductosService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('findAll', () => {
    it('should get all Productos', async () => {
      const paginateOptions = {
        page: 1,
        limit: 10,
        path: 'productos',
      }

      const testProductos = {
        data: [],
        meta: {
          itemsPerPage: 10,
          totalItems: 1,
          currentPage: 1,
          totalPages: 1,
        },
        links: {
          current: 'productos?page=1&limit=10&sortBy=nombre:ASC',
        },
      } as Paginated<ResponseProductoDto>

      jest.spyOn(service, 'findAll').mockResolvedValue(testProductos)
      const result: any = await controller.findAll(paginateOptions)

      // console.log(result)
      expect(result.meta.itemsPerPage).toEqual(paginateOptions.limit)
      // Expect the result to have the correct currentPage
      expect(result.meta.currentPage).toEqual(paginateOptions.page)
      // Expect the result to have the correct totalPages
      expect(result.meta.totalPages).toEqual(1) // You may need to adjust this value based on your test case
      // Expect the result to have the correct current link
      expect(result.links.current).toEqual(
        `productos?page=${paginateOptions.page}&limit=${paginateOptions.limit}&sortBy=nombre:ASC`,
      )
      expect(service.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should get one producto', async () => {
      const id = 1
      const mockResult: ResponseProductoDto = new ResponseProductoDto()

      jest.spyOn(service, 'findOne').mockResolvedValue(mockResult)
      await controller.findOne(id)
      expect(service.findOne).toHaveBeenCalledWith(id)
      expect(mockResult).toBeInstanceOf(ResponseProductoDto)
    })

    it('should throw NotFoundException if producto does not exist', async () => {
      const id = 1
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException())
      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    it('should create a producto', async () => {
      const dto: CreateProductoDto = {
        marca: 'test',
        modelo: 'test',
        descripcion: 'test',
        precio: 1,
        stock: 1,
        imagen: 'test',
        categoria: 'test',
      }
      const mockResult: ResponseProductoDto = new ResponseProductoDto()
      jest.spyOn(service, 'create').mockResolvedValue(mockResult)
      await controller.create(dto)
      expect(service.create).toHaveBeenCalledWith(dto)
      expect(mockResult).toBeInstanceOf(ResponseProductoDto)
    })
  })

  describe('update', () => {
    it('should update a producto', async () => {
      const id = 1
      const dto: UpdateProductoDto = {
        marca: 'test',
        modelo: 'test',
        isDeleted: true,
      }
      const mockResult: ResponseProductoDto = new ResponseProductoDto()
      jest.spyOn(service, 'update').mockResolvedValue(mockResult)
      await controller.update(id, dto)
      expect(service.update).toHaveBeenCalledWith(id, dto)
      expect(mockResult).toBeInstanceOf(ResponseProductoDto)
    })

    it('should throw NotFoundException if producto does not exist', async () => {
      const id = 1
      const dto: UpdateCategoriaDto = {}
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException())
      await expect(controller.update(id, dto)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('remove', () => {
    it('should remove a producto', async () => {
      const id = 1
      const mockResult: ResponseProductoDto = new ResponseProductoDto()
      jest.spyOn(service, 'removeSoft').mockResolvedValue(mockResult)
      await controller.remove(id)
      expect(service.removeSoft).toHaveBeenCalledWith(id)
    })

    it('should throw NotFoundException if producto does not exist', async () => {
      const id = 1
      jest
        .spyOn(service, 'removeSoft')
        .mockRejectedValue(new NotFoundException())
      await expect(controller.remove(id)).rejects.toThrow(NotFoundException)
    })
  })

  describe('updateImage', () => {
    it('should update a producto image', async () => {
      const mockId = 1
      const mockFile = {} as Express.Multer.File
      const mockReq = {} as Request
      const mockResult: ResponseProductoDto = new ResponseProductoDto()

      jest.spyOn(service, 'updateImage').mockResolvedValue(mockResult)

      await controller.updateImage(mockId, mockFile, mockReq)
      expect(service.updateImage).toHaveBeenCalledWith(
        mockId,
        mockFile,
        mockReq,
        true,
      )
      expect(mockResult).toBeInstanceOf(ResponseProductoDto)
    })
  })
})
