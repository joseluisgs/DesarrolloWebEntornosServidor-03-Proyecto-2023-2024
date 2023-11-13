import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { ObjectId } from 'mongodb'

@Injectable()
export class IdValidatePipe implements PipeTransform {
  transform(value: any) {
    if (!ObjectId.isValid(value)) {
      throw new BadRequestException(
        'El id especificado no es válido o no tiene el formato correcto',
      )
    }
    return value
  }
}
