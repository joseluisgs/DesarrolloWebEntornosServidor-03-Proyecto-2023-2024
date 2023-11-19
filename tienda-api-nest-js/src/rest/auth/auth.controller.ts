import { Body, Controller, Logger, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserSignUpDto } from './dto/user-sign.up.dto'
import { UserSignInDto } from './dto/user-sign.in.dto'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiExcludeEndpoint,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

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
  @ApiResponse({
    status: 200,
    description:
      'El usuario se ha logueado correctamente devolviendo el token de acceso',
    type: String,
  })
  @ApiBody({
    description: 'Credenciales de acceso',
    type: UserSignInDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno de la api en bases de datos',
  })
  @ApiBadRequestResponse({
    description: 'Error en los datos de entrada',
  })
  async singIn(@Body() userSignInDto: UserSignInDto) {
    this.logger.log(`singIn: ${JSON.stringify(userSignInDto)}`)
    return await this.authService.singIn(userSignInDto)
  }
}
