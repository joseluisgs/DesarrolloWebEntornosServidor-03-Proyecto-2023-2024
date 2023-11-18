import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { PedidosService } from '../pedidos.service'

@Injectable()
export class UsuarioExistsGuard implements CanActivate {
  constructor(private readonly pedidosService: PedidosService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const body = request.body
    const idUsuario = body.idUsuario

    if (!idUsuario) {
      throw new BadRequestException('El id del usuario es obligatorio')
    }

    // Lógica para verificar si el ID del usuario es válido
    if (isNaN(idUsuario)) {
      throw new BadRequestException('El id del usuario no es válido')
    }

    return this.pedidosService.userExists(idUsuario).then((exists) => {
      if (!exists) {
        throw new BadRequestException(
          'El ID del usuario no existe en el sistema',
        )
      }
      return true
    })
  }
}
