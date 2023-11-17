import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

/*
"Cuando este guardián se use en una ruta, valida el token JWT en la solicitud y,
si es válido, permite el acceso. Si no es válido, niega el acceso."
 */

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context)
  }
}
