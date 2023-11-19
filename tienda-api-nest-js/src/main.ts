import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as process from 'process'
import { ValidationPipe } from '@nestjs/common'
import { readFileSync } from 'fs'
import * as path from 'path'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  // Leemos la configuración de los certificados SSL
  const httpsOptions = {
    key: readFileSync(path.resolve(process.env.SSL_KEY)),
    cert: readFileSync(path.resolve(process.env.SSL_CERT)),
  }
  const app = await NestFactory.create(AppModule, { httpsOptions })
  // Swagger
  // Metadatos de la API
  if (process.env.NODE_ENV === 'dev') {
    const config = new DocumentBuilder()
      .setTitle('API REST Tienda Nestjs DAW 2023/2024')
      .setDescription(
        'API de ejemplo del curso Desarrollo de un API REST con Nestjs para 2º DAW. 2023/2024',
      )
      .setContact(
        'José Luis González Sánchez',
        'https://joseluisgs.dev',
        'joseluis.gonzalez@iesluisvives.org',
      )
      .setExternalDoc(
        'Documentación de la API',
        'https://github.com/joseluisgs/DesarrolloWebEntornosServidor-03-2023-2024',
      )
      /*.setExternalDoc(
        'GitHub del proyecto',
        'https://github.com/joseluisgs/DesarrolloWebEntornosServidor-03-Proyecto-2023-2024',
      )*/
      .setLicense('CC BY-NC-SA 4.0', 'https://joseluisgs.dev/docs/license/')
      .setVersion('1.0.0')
      .addTag('Productos', 'Operaciones con productos')
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)
  }
  // Lanzamos el servidor
  // Configuración de la versión de la API
  app.setGlobalPrefix(process.env.API_VERSION || 'v1')
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
