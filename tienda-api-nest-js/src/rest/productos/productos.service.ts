import {
  BadRequestException,
  Inject,
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
import { ResponseProductoDto } from './dto/response-producto.dto'
import { StorageService } from '../storage/storage.service'
import { Request } from 'express'
import { ProductsNotificationsGateway } from '../../websockets/notifications/products-notifications.gateway'
import {
  Notificacion,
  NotificacionTipo,
} from '../../websockets/notifications/models/notificacion.model'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'

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
    private readonly storageService: StorageService,
    private readonly productsNotificationsGateway: ProductsNotificationsGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  //Implementar el método findAll y findOne con inner join para que devuelva el nombre de la categoría

  async findAll(): Promise<ResponseProductoDto[]> {
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

  async findOne(id: number): Promise<ResponseProductoDto> {
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

  async create(
    createProductoDto: CreateProductoDto,
  ): Promise<ResponseProductoDto> {
    this.logger.log('Create producto ${createProductoDto}')
    const categoria = await this.checkCategoria(createProductoDto.categoria)
    const productoToCreate = this.productosMapper.toEntity(
      createProductoDto,
      categoria,
    )
    const productoCreated = await this.productoRepository.save(productoToCreate)
    const dto = this.productosMapper.toResponseDto(productoCreated)
    this.onChange(NotificacionTipo.CREATE, dto)
    return dto
  }

  async update(
    id: number,
    updateProductoDto: UpdateProductoDto,
  ): Promise<ResponseProductoDto> {
    this.logger.log(`Update producto by id:${id} - ${updateProductoDto}`)
    const productToUpdate = await this.findOne(id)
    let categoria: CategoriaEntity
    if (updateProductoDto.categoria) {
      // tiene categoria, comprobamos que exista
      categoria = await this.checkCategoria(updateProductoDto.categoria)
    } else {
      // no tiene categoria, dejamos la que tenía
      categoria = await this.checkCategoria(productToUpdate.categoria)
    }
    const productoUpdated = await this.productoRepository.save({
      ...productToUpdate,
      ...updateProductoDto,
      categoria,
    })
    const dto = this.productosMapper.toResponseDto(productoUpdated)
    this.onChange(NotificacionTipo.UPDATE, dto)
    return dto
  }

  async remove(id: number): Promise<ResponseProductoDto> {
    this.logger.log(`Remove producto by id:${id}`)
    const productToRemove = await this.exists(id)
    const productoRemoved =
      await this.productoRepository.remove(productToRemove)
    // Borramos su imagen si es distinta a la imagen por defecto
    if (productToRemove.imagen !== ProductoEntity.IMAGE_DEFAULT) {
      this.logger.log(`Borrando imagen ${productToRemove.imagen}`)
      this.storageService.removeFile(productToRemove.imagen)
    }
    const dto = this.productosMapper.toResponseDto(productoRemoved)
    this.onChange(NotificacionTipo.DELETE, dto)
    return dto
  }

  async removeSoft(id: number) {
    this.logger.log(`Remove producto by id:${id}`)
    const productToRemove = await this.exists(id)
    productToRemove.isDeleted = true
    const productoRemoved = await this.productoRepository.save(productToRemove)
    const dto = this.productosMapper.toResponseDto(productoRemoved)
    this.onChange(NotificacionTipo.DELETE, dto)
    return dto
  }

  public async checkCategoria(
    nombreCategoria: string,
  ): Promise<CategoriaEntity> {
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

  public async exists(id: number): Promise<ProductoEntity> {
    const product = await this.productoRepository.findOneBy({ id })
    if (!product) {
      this.logger.log(`Producto con id ${id} no encontrado`)
      throw new NotFoundException(`Producto con id ${id} no encontrado`)
    }
    return product
  }

  public async updateImage(
    id: number,
    file: Express.Multer.File,
    req: Request,
    withUrl: boolean = true,
  ) {
    this.logger.log(`Update image producto by id:${id}`)
    const productToUpdate = await this.exists(id)

    // Borramos su imagen si es distinta a la imagen por defecto
    if (productToUpdate.imagen !== ProductoEntity.IMAGE_DEFAULT) {
      this.logger.log(`Borrando imagen ${productToUpdate.imagen}`)
      let imagePath = productToUpdate.imagen
      if (withUrl) {
        imagePath = this.storageService.getFileNameWithouUrl(
          productToUpdate.imagen,
        )
      }
      try {
        this.storageService.removeFile(imagePath)
      } catch (error) {
        this.logger.error(error) // No lanzamos nada si no existe!!
      }
    }

    if (!file) {
      throw new BadRequestException('Fichero no encontrado.')
    }

    let filePath: string

    if (withUrl) {
      this.logger.log(`Generando url para ${file.filename}`)
      // Construimos la url del fichero, que será la url de la API + el nombre del fichero
      const apiVersion = process.env.API_VERSION
        ? `/${process.env.API_VERSION}`
        : ''
      filePath = `${req.protocol}://${req.get('host')}${apiVersion}/storage/${
        file.filename
      }`
    } else {
      filePath = file.filename
    }

    productToUpdate.imagen = filePath
    const productoUpdated = await this.productoRepository.save(productToUpdate)
    const dto = this.productosMapper.toResponseDto(productoUpdated)
    this.onChange(NotificacionTipo.UPDATE, dto)
    return dto
  }

  async invalidateCacheKey(key: string): Promise<void> {
    await this.cacheManager.del(key)
  }

  private onChange(tipo: NotificacionTipo, data: ResponseProductoDto) {
    const notificacion = new Notificacion<ResponseProductoDto>(
      'PRODUCTOS',
      tipo,
      data,
      new Date(),
    )
    // Lo enviamos
    this.productsNotificationsGateway.sendMessage(notificacion)
  }
}
