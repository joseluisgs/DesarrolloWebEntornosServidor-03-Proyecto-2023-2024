import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Usuario } from './entities/user.entity'
import { UserRole } from './entities/user-role.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]), // Importamos el repositorio de usuarios
    TypeOrmModule.forFeature([UserRole]), // Importamos el repositorio de roles
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
