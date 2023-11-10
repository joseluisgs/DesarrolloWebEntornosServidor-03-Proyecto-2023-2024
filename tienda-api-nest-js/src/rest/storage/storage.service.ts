import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import { join } from 'path'

@Injectable()
export class StorageService {
  private readonly uploadsDir = process.env.UPLOADS_DIR || './storage-dir'
  private readonly isDev = process.env.NODE_ENV === 'dev'
  private readonly logger = new Logger(StorageService.name)

  // Este método se ejecuta cuando el módulo se inicia
  // En este caso, si estamos en entorno de desarrollo, se eliminan los archivos
  // del directorio de uploads y se crea de nuevo.
  // Esto es para que cada vez que se inicie el servidor, el directorio esté vacío.
  async onModuleInit() {
    if (this.isDev) {
      if (fs.existsSync(this.uploadsDir)) {
        this.logger.log(`Eliminando ficheros de ${this.uploadsDir}`)
        fs.readdirSync(this.uploadsDir).forEach((file) => {
          fs.unlinkSync(path.join(this.uploadsDir, file))
        })
      } else {
        this.logger.log(
          `Creando directorio de subida de archivos en ${this.uploadsDir}`,
        )
        fs.mkdirSync(this.uploadsDir)
      }
    }
  }

  findFile(filename: string): string {
    this.logger.log(`Buscando fichero ${filename}`)
    const file = join(
      process.cwd(), // process.cwd() devuelve el directorio de trabajo actual
      process.env.UPLOADS_DIR || './storage-dir', // directorio de subida de archivos
      filename, // nombre del archivo
    )
    if (fs.existsSync(file)) {
      this.logger.log(`Fichero encontrado ${file}`)
      return file
    } else {
      throw new NotFoundException(`El fichero ${filename} no existe.`)
    }
  }

  getFileName(fileUrl: string): string {
    const url = new URL(fileUrl)
    const pathname = url.pathname // '/v1/storage/bd9e0f33-21b4-4abd-9659-069b6fcf7fb4.png'
    const segments = pathname.split('/')
    const filename = segments[segments.length - 1] // 'bd9e0f33-21b4-4abd-9659-069b6fcf7fb4.png'
    return filename
  }

  removeFile(filename: string): void {
    this.logger.log(`Eliminando fichero ${filename}`)
    const file = join(
      process.cwd(), // process.cwd() devuelve el directorio de trabajo actual
      process.env.UPLOADS_DIR || './storage-dir', // directorio de subida de archivos
      filename, // nombre del archivo
    )
    if (fs.existsSync(file)) {
      fs.unlinkSync(file)
    } else {
      throw new NotFoundException(`El fichero ${filename} no existe.`)
    }
  }
}
