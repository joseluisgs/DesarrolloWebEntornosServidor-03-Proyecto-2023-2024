import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as process from 'process'

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.DPOSTGRES_PORT) || 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  autoLoadEntities: true, // Esto es para que se carguen las entidades de las tablas de la base
  entities: [`${__dirname}/**/*.entity{.ts,.js}`], // Entidades de la base de datos (buscar archivos con extensión .entity.ts o .entity.js)
  synchronize: process.env.NODE_ENV === 'dev', // Esto es para que se sincronicen las entidades con la base de datos
  logging: process.env.NODE_ENV === 'dev' ? 'all' : false, // Esto es para que se muestren los logs de las consultas
}
