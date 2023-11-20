import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as process from 'process'
import { ValidationPipe } from '@nestjs/common'
import { setupSwagger } from './config/swagger/swagger.config'
import { getSSLOptions } from './config/ssl/ssl.config'

async function bootstrap() {
  if (process.env.NODE_ENV === 'dev') {
    console.log('🛠️ Iniciando Modo desarrollo')
  } else {
    console.log('🚗 Iniciando Modo producción')
  }
  // Obtener las opciones de SSL
  const httpsOptions = getSSLOptions()
  const app = await NestFactory.create(AppModule, { httpsOptions })
  // Configuración de la versión de la API
  app.setGlobalPrefix(process.env.API_VERSION || 'v1')
  // Configuración de Swagger
  if (process.env.NODE_ENV === 'dev') {
    setupSwagger(app)
  }
  // Activamos las validaciones body y dtos
  app.useGlobalPipes(new ValidationPipe())
  // Configuración del puerto de escucha
  await app.listen(process.env.API_PORT || 3000)
}

// Inicialización de la aplicación y cuando esté lista se muestra un mensaje en consola
bootstrap().then(() =>
  console.log(
    `🟢 Servidor escuchando en puerto: ${
      process.env.API_PORT || 3000
    } y perfil: ${process.env.NODE_ENV} 🚀`,
  ),
)
