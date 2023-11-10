import { INestApplication, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { CreateProductoDto } from '../../../src/rest/productos/dto/create-producto.dto'
import { UpdateProductoDto } from '../../../src/rest/productos/dto/update-producto.dto'
import { ProductosController } from '../../../src/rest/productos/productos.controller'
import { ProductosService } from '../../../src/rest/productos/productos.service'
import { ResponseProductoDto } from '../../../src/rest/productos/dto/response-producto.dto'

// https://ualmtorres.github.io/SeminarioTesting/#truetests-end-to-end
// https://blog.logrocket.com/end-end-testing-nestjs-typeorm/  <--- MUY BUENO
describe('ProductosController (e2e)', () => {
  let app: INestApplication
  const myEndpoint = `/productos`

  const myProductoResponse: ResponseProductoDto = {
    id: 1,
    marca: 'marca',
    modelo: 'modelo',
    descripcion: 'descripcion',
    precio: 100,
    stock: 10,
    imagen: 'imagen',
    uuid: 'uuid',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    categoria: 'categoria-test',
  }

  const createProductoDto: CreateProductoDto = {
    marca: 'marca',
    modelo: 'modelo',
    descripcion: 'descripcion',
    precio: 100,
    stock: 10,
    imagen: 'imagen',
    categoria: 'categoria-test',
  }

  const updateProductoDto: UpdateProductoDto = {
    marca: 'marca',
    isDeleted: false,
    categoria: 'categoria-test',
  }

  // My mock de repository
  const mockProductosService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    removeSoft: jest.fn(),
    updateImage: jest.fn(),
  }

  beforeEach(async () => {
    // Cargamos solo el controlador y el servicio que vamos a probar, no el módulo que arrastra con todo
    // No es de integración si no e2e, con mocks
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProductosController],
      providers: [
        ProductosService,
        { provide: ProductosService, useValue: mockProductosService },
      ],
    })
      // Le decimos a Nest que inyecte nuestro mock de servicio en lugar del servicio real.
      // Pero ya se lo hemos inyectado arriba
      // .overrideProvider(ProductosService)
      // .useValue(mockProductosService)
      .compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /productos', () => {
    it('should return an array of productos', async () => {
      // Configurar el mock para devolver un resultado específico
      mockProductosService.findAll.mockResolvedValue([myProductoResponse])

      const { body } = await request(app.getHttpServer())
        .get(myEndpoint)
        .expect(200)
      expect(() => {
        expect(body).toEqual([myProductoResponse])
        expect(mockProductosService.findAll).toHaveBeenCalled()
      })
    })
  })

  describe('GET /productos/:id', () => {
    it('should return a single producto', async () => {
      mockProductosService.findOne.mockResolvedValue(myProductoResponse)

      const { body } = await request(app.getHttpServer())
        .get(`${myEndpoint}/${myProductoResponse.id}`)
        .expect(200)
      expect(() => {
        expect(body).toEqual(myProductoResponse)
        expect(mockProductosService.findOne).toHaveBeenCalled()
      })
    })

    it('should throw an error if the producto does not exist', async () => {
      mockProductosService.findOne.mockRejectedValue(new NotFoundException())

      await request(app.getHttpServer())
        .get(`${myEndpoint}/${myProductoResponse.id}`)
        .expect(404)
    })
  })

  describe('POST /productos', () => {
    it('should create a new producto', async () => {
      mockProductosService.create.mockResolvedValue(myProductoResponse)

      const { body } = await request(app.getHttpServer())
        .post(myEndpoint)
        .send(createProductoDto)
        .expect(201)
      expect(() => {
        expect(body).toEqual(myProductoResponse)
        expect(mockProductosService.create).toHaveBeenCalledWith(
          createProductoDto,
        )
      })
    })
  })

  describe('PUT /prouctos/:id', () => {
    it('should update a producto', async () => {
      mockProductosService.update.mockResolvedValue(myProductoResponse)

      const { body } = await request(app.getHttpServer())
        .put(`${myEndpoint}/${myProductoResponse.id}`)
        .send(updateProductoDto)
        .expect(200)
      expect(() => {
        expect(body).toEqual(myProductoResponse)
        expect(mockProductosService.update).toHaveBeenCalledWith(
          myProductoResponse.id,
          updateProductoDto,
        )
      })
    })

    it('should throw an error if the producto does not exist', async () => {
      mockProductosService.update.mockRejectedValue(new NotFoundException())
      await request(app.getHttpServer())
        .put(`${myEndpoint}/${myProductoResponse.id}`)
        .send(mockProductosService)
        .expect(404)
    })
  })

  describe('DELETE /productos/:id', () => {
    it('should remove a producto', async () => {
      mockProductosService.remove.mockResolvedValue(myProductoResponse)

      await request(app.getHttpServer())
        .delete(`${myEndpoint}/${myProductoResponse.id}`)
        .expect(204)
    })

    it('should throw an error if the producto does not exist', async () => {
      mockProductosService.removeSoft.mockRejectedValue(new NotFoundException())
      await request(app.getHttpServer())
        .delete(`${myEndpoint}/${myProductoResponse.id}`)
        .expect(404)
    })
  })

  describe('PATCH /productos/imagen/:id', () => {
    it('should update the product image', async () => {
      const file = new Buffer('file')

      mockProductosService.updateImage.mockResolvedValue(myProductoResponse)

      await request(app.getHttpServer())
        .patch(`${myEndpoint}/imagen/${myProductoResponse.id}`)
        .attach('file', file, 'image.jpg')
        .set('Content-Type', 'multipart/form-data')
        .expect(200)

      // expect(mockProductosService.updateImage).toHaveBeenCalled()
    })
  })
})
