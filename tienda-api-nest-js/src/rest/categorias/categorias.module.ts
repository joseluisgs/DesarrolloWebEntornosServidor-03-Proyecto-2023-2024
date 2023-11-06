import { Module } from '@nestjs/common'
import { CategoriasService } from './categorias.service'
import { CategoriasController } from './categorias.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriaEntity } from './entities/categoria.entity'

@Module({
  // Importamos el servicio de categorias de TypeORM
  imports: [TypeOrmModule.forFeature([CategoriaEntity])],
  controllers: [CategoriasController],
  providers: [CategoriasService],
})
export class CategoriasModule {}
