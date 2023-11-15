import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Usuario } from './entities/user.entity'
import { UserRole } from './entities/user-role.entity'
import { UsuariosMapper } from './mappers/usuarios.mapper'
import { CacheModule } from '@nestjs/cache-manager'
import { BcryptService } from './bcrypt.service'
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose'
import { Pedido } from '../pedidos/schemas/pedido.schema'
import * as mongoosePaginate from 'mongoose-paginate-v2'

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]), // Importamos el repositorio de usuarios
    TypeOrmModule.forFeature([UserRole]), // Importamos el repositorio de roles
    CacheModule.register(), // Importamos el módulo de cache
    // Para manejar los pedidos, su repositorio
    MongooseModule.forFeatureAsync([
      {
        name: Pedido.name,
        useFactory: () => {
          const schema = SchemaFactory.createForClass(Pedido)
          schema.plugin(mongoosePaginate)
          return schema
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsuariosMapper, BcryptService],
  exports: [UsersService],
})
export class UsersModule {}
