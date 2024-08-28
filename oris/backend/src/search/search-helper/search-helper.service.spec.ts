import { Test, TestingModule } from '@nestjs/testing';
import { SearchHelperService } from './search-helper.service';

describe('SearchHelperService', () => {
  let service: SearchHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchHelperService],
    }).compile();

    service = module.get<SearchHelperService>(SearchHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
