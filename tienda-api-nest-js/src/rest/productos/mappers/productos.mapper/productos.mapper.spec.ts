import { Test, TestingModule } from '@nestjs/testing';
import { ProductosMapper } from './productos.mapper';

describe('ProductosMapper', () => {
  let provider: ProductosMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductosMapper],
    }).compile();

    provider = module.get<ProductosMapper>(ProductosMapper);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
