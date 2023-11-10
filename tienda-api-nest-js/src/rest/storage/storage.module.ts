import { Module } from '@nestjs/common'
import { StorageService } from './storage.service'
import { StorageController } from './storage.controller'

@Module({
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService], // exportamos el servicio para que pueda ser usado por otros módulos
})
export class StorageModule {}
