import { ProductoExistsGuard } from './producto-exists-guard'

describe('ProductoIdGuard', () => {
  it('should be defined', () => {
    expect(new ProductoExistsGuard()).toBeDefined()
  })
})
