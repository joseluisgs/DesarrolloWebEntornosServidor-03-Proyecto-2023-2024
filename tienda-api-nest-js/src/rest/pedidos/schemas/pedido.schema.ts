import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoosePaginate from 'mongoose-paginate-v2'

// Nuestro documento de la base de datos para poder usarlo en el servicio
// y en el controlador, lo usaremos para mapear los datos de la base de datos
export type PedidoDocument = Pedido & Document

// El esquema de la base de datos
@Schema({
  collection: 'pedidos', // Nombre de la colección en la base de datos
  timestamps: false, // No queremos que se añadan los campos createdAt y updatedAt, los añadimos nosotros
  // Este método toJSON se ejecutará cada vez que se llame a JSON.stringify() en un documento de Mongoose
  // mapea el _id a id y elimina __v y _id cuando se llama a JSON.stringify()
  versionKey: false,
  id: true,
  toJSON: {
    virtuals: true,
    // Aquí añadimos el método toJSON
    transform: (doc, ret) => {
      delete ret.__v
      ret.id = ret._id
      delete ret._id
      delete ret._class
    },
  },
})

// Usamos clases embebidas, por lo que definimos antes las necesarias
// Recursos adicionales
export class Direccion {
  @Prop({
    type: String,
    required: true,
    length: 100,
    default: '',
  })
  calle: string

  @Prop({
    type: String,
    required: true,
    length: 50,
    default: '',
  })
  numero: string

  @Prop({
    type: String,
    required: true,
    length: 100,
    default: '',
  })
  ciudad: string

  @Prop({
    type: String,
    required: true,
    length: 100,
    default: '',
  })
  provincia: string

  @Prop({
    type: String,
    required: true,
    length: 100,
    default: '',
  })
  pais: string

  @Prop({
    type: String,
    required: true,
    length: 100,
    default: '',
  })
  codigoPostal: string
}

export class Cliente {
  @Prop({
    type: String,
    required: true,
    length: 100,
    default: '',
  })
  nombreCompleto: string

  @Prop({
    type: String,
    required: true,
    length: 100,
    default: '',
  })
  email: string

  @Prop({
    type: String,
    required: true,
    length: 100,
    default: '',
  })
  telefono: string

  @Prop({
    required: true,
  })
  direccion: Direccion
}

export class LineaPedido {
  @Prop({
    type: Number,
    required: true,
  })
  idProducto: number

  @Prop({
    type: Number,
    required: true,
  })
  precioProducto: number

  @Prop({
    type: Number,
    required: true,
  })
  cantidad: number

  @Prop({
    type: Number,
    required: true,
  })
  total: number
}

// Nuestra clase principal (esquema)!!
// Definimos con @Prop() cada uno de los campos de la colección
export class Pedido {
  @Prop({
    type: Number,
    required: true,
  })
  idUsuario: number

  @Prop({
    required: true,
  })
  cliente: Cliente

  @Prop({
    required: true,
  })
  lineasPedido: LineaPedido[]

  @Prop()
  totalItems: number

  @Prop()
  total: number

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date

  @Prop({ default: false })
  isDeleted: boolean
}

// Genera el esquema de la base de datos a partir de la clase Pedido
// le añado el plugin de paginación que hemos importado
export const PedidoSchema = SchemaFactory.createForClass(Pedido)
PedidoSchema.plugin(mongoosePaginate)
