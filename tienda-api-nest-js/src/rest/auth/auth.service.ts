import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { UserSignUpDto } from './dto/user-sign.up.dto'
import { UserSignInDto } from './dto/user-sign.in.dto'
import { UsersService } from '../users/users.service'
import { AuthMapper } from './mappers/usuarios.mapper'
import { UserDto } from '../users/dto/user-response.dto'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly usersService: UsersService,
    private readonly authMapper: AuthMapper,
    private readonly jwtService: JwtService,
  ) {}

  async singUp(userSignUpDto: UserSignUpDto) {
    this.logger.log(`singUp ${userSignUpDto.username}`)

    const user = await this.usersService.create(
      this.authMapper.toCreateDto(userSignUpDto),
    )
    return this.getAccessToken(user)
  }

  async singIn(userSignInDto: UserSignInDto) {
    this.logger.log(`singIn ${userSignInDto.username}`)
    return userSignInDto
  }

  // TODO!!!

  private getAccessToken(userDto: UserDto) {
    this.logger.log(`getAccessToken ${userDto.username}`)
    try {
      const payload = {
        id: userDto.id,
      }
      //console.log(payload)
      const access_token = this.jwtService.sign(payload)
      return {
        access_token,
      }
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException('Error al generar el token')
    }
  }
}
