import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

@Module({})
export class CorsConfigModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
        res.header(
          'Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept',
        )
        next()
      })
      .forRoutes('*')
  }
}
