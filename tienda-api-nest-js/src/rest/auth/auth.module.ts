import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from '../users/users.module'
import { AuthMapper } from './mappers/usuarios.mapper'

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, AuthMapper],
})
export class AuthModule {}
