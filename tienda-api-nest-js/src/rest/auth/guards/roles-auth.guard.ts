import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class RolesAuthGuard implements CanActivate {
  private readonly roles: string[] = []

  constructor(...roles: string[]) {
    this.roles = roles
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp()
    const { user } = ctx.getRequest() // Obtenemos el usuario, es lo mismo que ctx.getRequest().user

    // Si el usuario no tiene roles, no tiene acceso
    const hasRequiredRole = user.roles.some((role) => this.roles.includes(role))

    if (!hasRequiredRole) {
      throw new ForbiddenException('Forbidden Role: You do not have access')
    }

    return true
  }
}
