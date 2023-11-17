import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  SetMetadata,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

/**
 * RolesAuthGuard es un guardián personalizado que implementa la interfaz CanActivate de NestJS.
 * Los guardianes son responsables de determinar si una solicitud debe ser manejada por la ruta o no.
 *
 * El constructor de RolesAuthGuard inyecta una instancia de Reflector, que es
 * una utilidad proporcionada por NestJS para recuperar metadatos.
 *
 * La función canActivate es el corazón del guardián. Se llama cada vez que una
 * solicitud entra en una ruta que está protegida por este guardián.
 *
 * Dentro de canActivate, primero usamos Reflector para obtener los roles requeridos
 * del manejador de ruta. Estos roles son metadatos que se agregaron al manejador de ruta utilizando el decorador @Roles.
 *
 * Si no se requieren roles para la ruta, permitimos que la solicitud pase.
 *
 * Luego, obtenemos el objeto de usuario de la solicitud. Este objeto de usuario
 * debe haber sido adjuntado a la solicitud por un middleware o guardián anterior, como JwtAuthGuard.
 *
 * Comprobamos si el usuario tiene alguno de los roles requeridos. Si es así,
 * permitimos que la solicitud pase. Si no, la solicitud es denegada.
 */

@Injectable()
export class RolesAuthGuard implements CanActivate {
  private readonly logger = new Logger(RolesAuthGuard.name)

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler())
    this.logger.log(`Roles: ${roles}`)
    if (!roles) {
      return true
    }
    const request = context.switchToHttp().getRequest()
    const user = request.user
    this.logger.log(`User roles: ${user.roles}`)
    // Al menos tenga un rol de los requeridos!!
    const hasRole = () => user.roles.some((role) => roles.includes(role))
    return user && user.roles && hasRole()
  }
}

/*
SetMetadata es una función proporcionada por NestJS que te permite agregar metadatos personalizados
a los manejadores de ruta. Estamos creando una nueva función, Roles, que toma una lista de roles
y utiliza SetMetadata para agregarlos como metadatos al manejador de ruta.
Podrás poner los roles requeridos en la ruta usando el decorador @Roles.
 */
// El decorador
export const Roles = (...roles: string[]) => SetMetadata('roles', roles)
