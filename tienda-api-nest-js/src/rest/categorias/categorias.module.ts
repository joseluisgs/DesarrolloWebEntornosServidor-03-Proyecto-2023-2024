import { Module } from '@nestjs/common'
import { CategoriasService } from './categorias.service'
import { CategoriasController } from './categorias.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriaEntity } from './entities/categoria.entity'
import { CategoriasMapper } from './mappers/categorias.mapper'
import { CacheModule } from '@nestjs/cache-manager'

@Module({
  // Importamos el servicio de categorias de TypeORM
  imports: [
    TypeOrmModule.forFeature([CategoriaEntity]),
    CacheModule.register(),
  ],
  controllers: [CategoriasController],
  providers: [CategoriasService, CategoriasMapper],
  exports: [],
})
export class CategoriasModule {}
