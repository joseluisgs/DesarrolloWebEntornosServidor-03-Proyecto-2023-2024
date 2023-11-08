import { INestApplication, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { CategoriasService } from '../../../src/rest/categorias/categorias.service'
import { CategoriaEntity } from '../../../src/rest/categorias/entities/categoria.entity'
import * as request from 'supertest'
import { CategoriasController } from '../../../src/rest/categorias/categorias.controller'

describe('CategoriasController (e2e)', () => {
  let app: INestApplication
  const myEndpoint = `/categorias`

  const myCategoria: CategoriaEntity = {
    id: '7958ef01-9fe0-4f19-a1d5-79c917290ddf',
    nombre: 'nombre',
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    productos: [],
  }

  const createCategoriaDto = {
    nombre: 'nombre',
  }

  const updateCategoriaDto = {
    nombre: 'nombre',
    isDeleted: false,
  }

  // Mock de servicio y sus metodos
  const mockCategoriasService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    removeSoft: jest.fn(),
  }

  beforeEach(async () => {
    // Cargamos solo el controlador y el servicio que vamos a probar, no el módulo que arrastra con todo
    // No es de integración si no e2e, con mocks
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CategoriasController],
      providers: [
        CategoriasService,
        { provide: CategoriasService, useValue: mockCategoriasService },
      ],
    })
      // Le decimos a Nest que inyecte nuestro mock de servicio en lugar del servicio real.
      .overrideProvider(CategoriasService)
      .useValue(mockCategoriasService)
      .compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /categorias', () => {
    it('should return an array of categorias', async () => {
      // Configurar el mock para devolver un resultado específico
      mockCategoriasService.findAll.mockResolvedValue([myCategoria])

      const { body } = await request(app.getHttpServer())
        .get(myEndpoint)
        .expect(200)
      expect(() => {
        expect(body).toEqual([myCategoria])
        expect(mockCategoriasService.findAll).toHaveBeenCalled()
      })
    })

    describe('GET /categorias/:id', () => {
      it('should return a single categoria', async () => {
        mockCategoriasService.findOne.mockResolvedValue(myCategoria)

        const { body } = await request(app.getHttpServer())
          .get(`${myEndpoint}/${myCategoria.id}`)
          .expect(200)
        expect(() => {
          expect(body).toEqual(myCategoria)
          expect(mockCategoriasService.findOne).toHaveBeenCalled()
        })
      })

      it('should throw an error if the category does not exist', async () => {
        mockCategoriasService.findOne.mockRejectedValue(new NotFoundException())

        await request(app.getHttpServer())
          .get(`${myEndpoint}/${myCategoria.id}`)
          .expect(404)
      })
    })

    describe('POST /categorias', () => {
      it('should create a new categoria', async () => {
        mockCategoriasService.create.mockResolvedValue(myCategoria)

        const { body } = await request(app.getHttpServer())
          .post(myEndpoint)
          .send(createCategoriaDto)
          .expect(201)
        expect(() => {
          expect(body).toEqual(myCategoria)
          expect(mockCategoriasService.create).toHaveBeenCalledWith(
            createCategoriaDto,
          )
        })
      })
    })

    describe('PUT /categorias/:id', () => {
      it('should update a categoria', async () => {
        mockCategoriasService.update.mockResolvedValue(myCategoria)

        const { body } = await request(app.getHttpServer())
          .put(`${myEndpoint}/${myCategoria.id}`)
          .send(updateCategoriaDto)
          .expect(200)
        expect(() => {
          expect(body).toEqual(myCategoria)
          expect(mockCategoriasService.update).toHaveBeenCalledWith(
            myCategoria.id,
            updateCategoriaDto,
          )
        })
      })

      it('should throw an error if the category does not exist', async () => {
        mockCategoriasService.update.mockRejectedValue(new NotFoundException())
        await request(app.getHttpServer())
          .put(`${myEndpoint}/${myCategoria.id}`)
          .send(updateCategoriaDto)
          .expect(404)
      })
    })

    describe('DELETE /categorias/:id', () => {
      it('should remove a categoria', async () => {
        mockCategoriasService.remove.mockResolvedValue(myCategoria)

        await request(app.getHttpServer())
          .delete(`${myEndpoint}/${myCategoria.id}`)
          .expect(204)
      })

      it('should throw an error if the category does not exist', async () => {
        mockCategoriasService.removeSoft.mockRejectedValue(
          new NotFoundException(),
        )
        await request(app.getHttpServer())
          .delete(`${myEndpoint}/${myCategoria.id}`)
          .expect(404)
      })
    })
  })
})
