import {Module} from '@nestjs/common';
import {ProductsNotificationsGateway} from './products-notifications.gateway';

@Module({
    providers: [ProductsNotificationsGateway],
    exports: [ProductsNotificationsGateway],
})
export class NotificationsModule {
}
