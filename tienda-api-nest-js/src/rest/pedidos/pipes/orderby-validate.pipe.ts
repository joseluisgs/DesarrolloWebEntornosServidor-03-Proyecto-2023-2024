import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { PedidosOrderByValues } from '../pedidos.service'

@Injectable()
export class OrderByValidatePipe implements PipeTransform {
  transform(value: any) {
    // Lógica para verificar si el orderBy es válido: meter aquí la lógica
    value = value || PedidosOrderByValues[0]
    if (!PedidosOrderByValues.includes(value)) {
      throw new BadRequestException(
        `No se ha especificado un campo para ordenar válido: ${PedidosOrderByValues.join(
          ', ',
        )}`,
      )
    }
    return value
  }
}
