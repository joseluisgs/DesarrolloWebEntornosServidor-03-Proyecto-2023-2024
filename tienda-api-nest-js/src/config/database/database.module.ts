import * as process from 'process'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    // Configurar el módulo de base de datos de Postgres
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
        entities: [`${__dirname}/**/*.entity{.ts,.js}`], // Cargamos todas las entidades
        synchronize: process.env.NODE_ENV === 'dev', // Esto es para que se sincronicen las entidades con la base de datos
        logging: process.env.NODE_ENV === 'dev' ? 'all' : false, // Esto es para que se muestren los logs de las consultas
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
