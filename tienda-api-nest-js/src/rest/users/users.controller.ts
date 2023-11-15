import { Controller, Get, Logger } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name)

  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    this.logger.log('findAll')
    return await this.usersService.findAll()
  }

  @Get(':id')
  async findOne(id: number) {
    this.logger.log(`findOne: ${id}`)
    return await this.usersService.findOne(id)
  }
}
