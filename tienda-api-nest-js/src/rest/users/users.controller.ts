import { Controller, Get, Logger } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name)

  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    this.logger.log('findAll')
    return this.usersService.findAll()
  }

  @Get(':id')
  findOne(id: number) {
    this.logger.log(`findOne: ${id}`)
    return this.usersService.findOne(id)
  }
}
