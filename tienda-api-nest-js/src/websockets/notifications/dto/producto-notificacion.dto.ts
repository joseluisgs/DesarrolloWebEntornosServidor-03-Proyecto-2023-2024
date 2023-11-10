export class ProductoNotificacionResponse {
    constructor(
        public id: number,
        public marca: string,
        public modelo: string,
        public descripcion: string,
        public precio: number,
        public imagen: string,
        public stock: number,
        public categoria: string,
        public uuid: string,
        public isDeleted: boolean,
        public createdAt: string,
        public updatedAt: string
    ) {
    }
}
