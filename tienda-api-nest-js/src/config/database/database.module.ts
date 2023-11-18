import * as process from 'process'
import { Logger, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MongooseModule } from '@nestjs/mongoose'
import * as path from 'path'

@Module({
  imports: [
    // Configurar el módulo de base de datos de Postgres asíncronamente
    // TypeOrm
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT) || 5432,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        autoLoadEntities: true,
        //entities: [`${__dirname}/**/*.entity{.ts,.js}`], // Cargamos todas las entidades
        // Entities no estan en config ahora, si no en /rest
        entities: [
          path.join(__dirname),
          '../../dist/rest/**/*.entity{.ts,.js}',
        ], // Cargamos todas las entidades,
        synchronize: process.env.NODE_ENV === 'dev', // Esto es para que se sincronicen las entidades con la base de datos
        logging: process.env.NODE_ENV === 'dev' ? 'all' : false, // Esto es para que se muestren los logs de las consultas
        retryAttempts: 5,
        connectionFactory: (connection) => {
          Logger.log('Postgres database connected', 'DatabaseModule')
          return connection
        },
      }),
    }),
    // Configurar MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        uri: `mongodb://${process.env.DATABASE_USER}:${
          process.env.DATABASE_PASSWORD
        }@${process.env.MONGO_HOST}:${process.env.MONGO_PORT || 27017}/${
          process.env.MONGO_DATABASE
        }`,
        retryAttempts: 5,
        connectionFactory: (connection) => {
          Logger.log(
            `MongoDB readyState: ${connection.readyState}`,
            'DatabaseModule',
          )
          return connection
        },
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
