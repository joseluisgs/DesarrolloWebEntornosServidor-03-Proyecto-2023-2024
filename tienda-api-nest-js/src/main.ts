import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as process from 'process'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // Configuración de la versión de la API
  app.setGlobalPrefix(process.env.API_VERSION || 'v1')
  // Configuración del puerto de escucha
  await app.listen(process.env.API_PORT || 3000)
}

// Inicialización de la aplicación y cuando esté lista se muestra un mensaje en consola
bootstrap().then(() =>
  console.log(
    `🟢 Servidor escuchando en puerto: ${
      process.env.API_PORT || 3000
    } y perfil: ${process.env.PERFIL} 🚀`,
  ),
)
