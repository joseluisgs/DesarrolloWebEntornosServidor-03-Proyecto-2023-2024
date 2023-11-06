import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasMapper } from './categorias.mapper';

describe('CategoriasMapper', () => {
  let provider: CategoriasMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriasMapper],
    }).compile();

    provider = module.get<CategoriasMapper>(CategoriasMapper);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
