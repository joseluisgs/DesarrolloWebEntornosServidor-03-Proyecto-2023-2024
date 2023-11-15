import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { BcryptService } from './bcrypt.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService, BcryptService],
})
export class AuthModule {}
