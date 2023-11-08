import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreateProductoDto } from './dto/create-producto.dto'
import { UpdateProductoDto } from './dto/update-producto.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductoEntity } from './entities/producto.entity'
import { Repository } from 'typeorm'
import { CategoriaEntity } from '../categorias/entities/categoria.entity'
import { ProductosMapper } from './mappers/productos.mapper/productos.mapper'

@Injectable()
export class ProductosService {
  private readonly logger: Logger = new Logger(ProductosService.name)

  // Inmyectamos el repositorio de la entidad ProductoEntity
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
    @InjectRepository(CategoriaEntity)
    private readonly categoriaRepository: Repository<CategoriaEntity>,
    private readonly productosMapper: ProductosMapper,
  ) {}

  //Implementar el método findAll y findOne con inner join para que devuelva el nombre de la categoría

  async findAll() {
    this.logger.log('Find all productos')
    // No puedo usar .find, porque quiero devolver el nombre de la categoría
    // Uso leftJoinAndSelect para que me devuelva los productos con la categoría
    const productos = await this.productoRepository
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.categoria', 'categoria')
      .orderBy('producto.id', 'ASC')
      .getMany()

    return productos.map((producto) =>
      this.productosMapper.toResponseDto(producto),
    )
  }

  async findOne(id: number) {
    this.logger.log(`Find one producto by id:${id}`)
    // No puedo usar .findOneBy, porque quiero devolver el nombre de la categoría
    const productToFind = await this.productoRepository
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.categoria', 'categoria')
      .where('producto.id = :id', { id })
      .getOne()

    if (!productToFind) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`)
    }

    return this.productosMapper.toResponseDto(productToFind)
  }

  async create(createProductoDto: CreateProductoDto) {
    this.logger.log('Create producto ${createProductoDto}')
    const categoria = await this.checkCategoria(createProductoDto.categoria)
    const productoToCreate = this.productosMapper.toEntity(
      createProductoDto,
      categoria,
    )
    const productoCreated = await this.productoRepository.save(productoToCreate)
    return this.productosMapper.toResponseDto(productoCreated)
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    this.logger.log(`Update producto by id:${id} - ${updateProductoDto}`)
    const productToUpdate = await this.exists(id)
    let categoria: CategoriaEntity
    if (updateProductoDto.categoria) {
      categoria = await this.checkCategoria(updateProductoDto.categoria)
    }
    const productoUpdated = await this.productoRepository.save({
      ...productToUpdate,
      ...updateProductoDto,
      categoria: categoria ? categoria : productToUpdate.categoria,
    })
    return this.productosMapper.toResponseDto(productoUpdated)
  }

  async remove(id: number) {
    this.logger.log(`Remove producto by id:${id}`)
    const productToRemove = await this.exists(id)
    return await this.productoRepository.remove(productToRemove)
  }

  async removeSoft(id: number) {
    this.logger.log(`Remove producto by id:${id}`)
    const productToRemove = await this.exists(id)
    productToRemove.isDeleted = true
    return await this.productoRepository.save(productToRemove)
  }

  private async exists(id: number) {
    const product = await this.productoRepository.findOneBy({ id })
    if (!product) {
      this.logger.log(`Producto con id ${id} no encontrado`)
      throw new NotFoundException(`Producto con id ${id} no encontrado`)
    }
    return product
  }

  private async checkCategoria(nombreCategoria: string) {
    // Comprobamos si existe la categoria
    // No uso el fin por la minúscula porque no es case sensitive
    const categoria = await this.categoriaRepository
      .createQueryBuilder()
      .where('LOWER(nombre) = LOWER(:nombre)', {
        nombre: nombreCategoria.toLowerCase(),
      })
      .getOne()

    if (!categoria) {
      this.logger.log(`Categoría ${nombreCategoria} no existe`)
      throw new BadRequestException(`Categoría ${nombreCategoria} no existe`)
    }

    return categoria
  }
}
