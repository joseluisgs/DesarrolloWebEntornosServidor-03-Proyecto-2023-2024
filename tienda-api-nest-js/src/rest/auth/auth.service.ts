import { Injectable, Logger } from '@nestjs/common'
import { UserSignUpDto } from './dto/user-sign.up.dto'
import { UserSignInDto } from './dto/user-sign.in.dto'
import { UsersService } from '../users/users.service'
import { AuthMapper } from './mappers/usuarios.mapper'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly usersService: UsersService,
    private readonly authMapper: AuthMapper,
  ) {}

  async singUp(userSignUpDto: UserSignUpDto) {
    this.logger.log(`singUp ${userSignUpDto.username}`)

    return await this.usersService.create(
      this.authMapper.toCreateDto(userSignUpDto),
    )
  }

  async singIn(userSignInDto: UserSignInDto) {
    this.logger.log(`singIn ${userSignInDto.username}`)
    return userSignInDto
  }
}
