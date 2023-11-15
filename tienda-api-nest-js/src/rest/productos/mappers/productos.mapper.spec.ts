import { Test, TestingModule } from '@nestjs/testing'
import { ProductosMapper } from './productos.mapper'
import { CreateProductoDto } from '../../dto/create-producto.dto'
import { ProductoEntity } from '../../entities/producto.entity'
import { CategoriaEntity } from '../../../categorias/entities/categoria.entity'
import { ResponseProductoDto } from '../../dto/response-producto.dto'
import { v4 as uuidv4 } from 'uuid'

describe('ProductosMapper', () => {
  let productosMapper: ProductosMapper

  const categoriaEntity: CategoriaEntity = {
    id: '51310e5f-4b47-4994-9f66-975bbdacdd35',
    nombre: 'Categoria 1',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: true,
    productos: [],
  }

  const createProductoDto: CreateProductoDto = {
    marca: 'Producto 1',
    modelo: 'Modelo del producto 1',
    descripcion: 'Descripción del producto 1',
    precio: 1000,
    stock: 10,
    imagen: 'https://www.google.com',
    categoria: categoriaEntity.id,
  }

  const productoEntity: ProductoEntity = {
    id: 1,
    marca: 'Producto 1',
    modelo: 'Modelo del producto 1',
    descripcion: 'Descripción del producto 1',
    precio: 1000,
    stock: 10,
    imagen: 'https://www.google.com',
    categoria: categoriaEntity,
    uuid: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductosMapper],
    }).compile()

    productosMapper = module.get<ProductosMapper>(ProductosMapper)
  })

  it('should be defined', () => {
    expect(productosMapper).toBeDefined()
  })

  it('should map CreateProductoDto to ProductoEntity', () => {
    const expectedProductoEntity: ProductoEntity = {
      ...productoEntity,
      categoria: categoriaEntity,
    }

    const actualProductoEntity: ProductoEntity = productosMapper.toEntity(
      createProductoDto,
      categoriaEntity,
    )

    expect(actualProductoEntity).toBeInstanceOf(ProductoEntity)

    expect(actualProductoEntity.marca).toEqual(expectedProductoEntity.marca)
    expect(actualProductoEntity.modelo).toEqual(expectedProductoEntity.modelo)
    expect(actualProductoEntity.descripcion).toEqual(
      expectedProductoEntity.descripcion,
    )
    expect(actualProductoEntity.precio).toEqual(expectedProductoEntity.precio)
    expect(actualProductoEntity.stock).toEqual(expectedProductoEntity.stock)
    expect(actualProductoEntity.imagen).toEqual(expectedProductoEntity.imagen)
    expect(actualProductoEntity.categoria).toEqual(
      expectedProductoEntity.categoria,
    )
  })

  it('should map ProductoEntity to ResponseProductoDto', () => {
    const expectedResponseProductoDto: ResponseProductoDto = {
      ...productoEntity,
      categoria: categoriaEntity.nombre,
    }

    const actualResponseProductoDto: ResponseProductoDto =
      productosMapper.toResponseDto(productoEntity)

    expect(actualResponseProductoDto).toBeInstanceOf(ResponseProductoDto)

    expect(actualResponseProductoDto.marca).toEqual(productoEntity.marca)
    expect(actualResponseProductoDto.modelo).toEqual(productoEntity.modelo)
    expect(actualResponseProductoDto.descripcion).toEqual(
      productoEntity.descripcion,
    )
    expect(actualResponseProductoDto.precio).toEqual(productoEntity.precio)
    expect(actualResponseProductoDto.stock).toEqual(productoEntity.stock)
    expect(actualResponseProductoDto.imagen).toEqual(productoEntity.imagen)
    expect(actualResponseProductoDto.categoria).toEqual(
      expectedResponseProductoDto.categoria,
    )
  })
})
