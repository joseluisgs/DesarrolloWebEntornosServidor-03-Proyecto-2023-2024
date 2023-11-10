import {Module} from '@nestjs/common'
import {ProductosModule} from './rest/productos/productos.module'
import {ConfigModule} from '@nestjs/config'
import {TypeOrmModule} from '@nestjs/typeorm'
import {CategoriasModule} from './rest/categorias/categorias.module'
import {StorageModule} from './rest/storage/storage.module';
import {NotificationsModule} from './websockets/notifications/notifications.module';
import * as process from 'process'

@Module({
    imports: [
        // Lo primero es cargar la configuración de la aplicación y que esta esté disponible en el módulo raíz
        ConfigModule.forRoot(),
        // Configurar el módulo de base de datos de Postgres
        // TypeOrm
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST || 'localhost',
            port: parseInt(process.env.DPOSTGRES_PORT) || 5432,
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            autoLoadEntities: true, // Esto es para que se carguen las entidades de las tablas de la base
            entities: [`${__dirname}/**/*.entity{.ts,.js}`], // carregando as models automaticamente
            synchronize: process.env.NODE_ENV === 'dev', // Esto es para que se sincronicen las entidades con la base de datos
            logging: process.env.NODE_ENV === 'dev' ? 'all' : false, // Esto es para que se muestren los logs de las consultas
        }),
        // Luego se cargan los módulos de la aplicación
        ProductosModule,
        CategoriasModule,
        StorageModule,
        NotificationsModule,
    ],
    controllers: [],
})
export class AppModule {
}
