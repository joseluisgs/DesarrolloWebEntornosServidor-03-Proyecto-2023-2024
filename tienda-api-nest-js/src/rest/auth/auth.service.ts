import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { UserSignUpDto } from './dto/user-sign.up.dto'
import { UserSignInDto } from './dto/user-sign.in.dto'
import { UsersService } from '../users/users.service'
import { AuthMapper } from './mappers/usuarios.mapper'
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
    return this.getAccessToken(user.id)
  }

  async singIn(userSignInDto: UserSignInDto) {
    this.logger.log(`singIn ${userSignInDto.username}`)
    const user = await this.usersService.findByUsername(userSignInDto.username)
    if (!user) {
      throw new BadRequestException('username or password are invalid')
    }
    const isValidPassword = await this.usersService.validatePassword(
      userSignInDto.password, // plain
      user.password, // hash
    )
    if (!isValidPassword) {
      throw new BadRequestException('username or password are invalid')
    }
    return this.getAccessToken(user.id)
  }

  async validateUser(id: number) {
    this.logger.log(`validateUser ${id}`)
    return await this.usersService.findOne(id)
  }

  private getAccessToken(userId: number) {
    this.logger.log(`getAccessToken ${userId}`)
    try {
      const payload = {
        id: userId,
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
