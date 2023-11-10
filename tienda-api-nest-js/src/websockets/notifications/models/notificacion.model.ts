export class Notificacion<T> {
  constructor(
    public entity: string,
    public type: NotificacionTipo,
    public data: T,
    public createdAt: Date,
  ) {}
}

export enum NotificacionTipo {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}
