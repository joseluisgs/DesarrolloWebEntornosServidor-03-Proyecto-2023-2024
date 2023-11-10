import {WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {Logger} from "@nestjs/common";
import * as process from "process";
import {Notificacion} from "./models/notificacion.model";
import {ResponseProductoDto} from "../../rest/productos/dto/response-producto.dto";

const ENDPOINT: string = '/ws/' + (process.env.API_VERSION || 'v1') + '/productos'

@WebSocketGateway({
    namespace: ENDPOINT,
})
export class ProductsNotificationsGateway {
    @WebSocketServer()
    private server: Server;
    private readonly logger = new Logger(ProductsNotificationsGateway.name)

    constructor() {
        this.logger.log('ProductsNotificationsGateway is listening on ' + ENDPOINT);
    }

    sendMessage(notification: Notificacion<ResponseProductoDto>) {
        this.server.emit('updates', notification);
    }

    private handleConnection(client: Socket) {
        // Este método se ejecutará cuando un cliente se conecte al WebSocket
        this.logger.debug('Cliente conectado:', client.id)
        this.server.emit('connection', "Updates Notifications WS: Productos - Tienda API NestJS");

    }

    private handleDisconnect(client: Socket) {
        // Este método se ejecutará cuando un cliente se desconecte del WebSocket
        console.log('Cliente desconectado:', client.id);
        this.logger.debug('Cliente desconectado:', client.id)
    }
}
