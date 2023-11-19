import { Body, Controller, Logger, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserSignUpDto } from './dto/user-sign.up.dto'
import { UserSignInDto } from './dto/user-sign.in.dto'
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiExcludeEndpoint() // Excluir el endpoint de Swagger
  async singUp(@Body() userSignUpDto: UserSignUpDto) {
    this.logger.log(`singUp: ${JSON.stringify(userSignUpDto)}`)
    return await this.authService.singUp(userSignUpDto)
  }

  @Post('signin')
  async singIn(@Body() userSignInDto: UserSignInDto) {
    this.logger.log(`singIn: ${JSON.stringify(userSignInDto)}`)
    return await this.authService.singIn(userSignInDto)
  }
}
