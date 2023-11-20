import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class BcryptService {
  private ROUNDS = 12

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.ROUNDS)
  }

  async isMatch(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }
}
