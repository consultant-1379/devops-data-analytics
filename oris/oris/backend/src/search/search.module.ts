import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticsearchConfigService } from './search.config';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchHelperService } from './search-helper/search-helper.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useClass: ElasticsearchConfigService,
    }),
  ],
  providers: [SearchService, SearchHelperService],
  controllers: [SearchController],
})
export class SearchModule {}
