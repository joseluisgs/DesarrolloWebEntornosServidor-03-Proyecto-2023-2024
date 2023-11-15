import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserSignUpDto } from './dto/user-sign.up.dto'
import { UserSignInDto } from './dto/user-sign.in.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  singUp(@Body() userSignUpDto: UserSignUpDto) {
    return this.authService.singUp(userSignUpDto)
  }

  @Post('sign-in')
  singIn(@Body() userSignInDto: UserSignInDto) {
    return this.authService.singIn(userSignInDto)
  }
}
