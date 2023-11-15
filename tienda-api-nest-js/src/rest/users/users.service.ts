import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)

  findAll() {
    this.logger.log('findAll')
    return `This action returns all users`
  }

  findOne(id: number) {
    this.logger.log(`findOne: ${id}`)
    return `This action returns a #${id} user`
  }
}
