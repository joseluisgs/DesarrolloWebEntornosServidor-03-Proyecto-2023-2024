import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as process from 'process'
import { ValidationPipe } from '@nestjs/common'
import { setupSwagger } from './config/swagger/swagger.config'
import { getSSLOptions } from './config/ssl/ssl.config'

// Cargamos las variables de entorno con esta librería porque las necesitamos
// antes de iniciar la aplicación (el propio nest nos permite hacerlo con su módulo config)
// Pero como necesitamos las variables antes de iniciar la aplicación y no tenemos su módulo aún cargado
// usamos esta librería para cargarlas antes de iniciar la aplicación
import * as dotenv from 'dotenv'

dotenv.config() // Cargamos las variables de entorno

async function bootstrap() {
  // Mostramos el modo de la aplicación
  if (process.env.NODE_ENV === 'dev') {
    console.log('🛠️ Iniciando Nestjs Modo desarrollo 🛠️')
  } else {
    console.log('🚗 Iniciando Nestjs Modo producción 🚗')
  }

  // Obtener las opciones de SSL
  const httpsOptions = getSSLOptions()

  // Inicialización de la aplicación
  const app = await NestFactory.create(AppModule, { httpsOptions })

  // Configuración de la versión de la API
  app.setGlobalPrefix(process.env.API_VERSION || 'v1')

  // Configuración de Swagger solo en modo desarrollo
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
