import { Injectable, Logger } from '@nestjs/common'
import { UserSignUpDto } from './dto/user-sign.up.dto'
import { UserSignInDto } from './dto/user-sign.in.dto'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  async singUp(userSignUpDto: UserSignUpDto) {
    this.logger.log(`singUp ${userSignUpDto.username}`)
    return userSignUpDto
  }

  async singIn(userSignInDto: UserSignInDto) {
    this.logger.log(`singIn ${userSignInDto.username}`)
    return userSignInDto
  }
}
