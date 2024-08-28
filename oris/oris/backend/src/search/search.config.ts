import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  ElasticsearchModuleOptions,
  ElasticsearchOptionsFactory,
} from '@nestjs/elasticsearch';
import { ElasticSearchConfig } from '../custom-config/custom-config';

@Injectable()
export class ElasticsearchConfigService implements ElasticsearchOptionsFactory {

  constructor(
    @Inject(ElasticSearchConfig.KEY)
    private esConfig: ConfigType<typeof ElasticSearchConfig>,
  ) {}

  createElasticsearchOptions(): ElasticsearchModuleOptions {
    return {
      node: this.esConfig.nodeUrl,
      tls: { rejectUnauthorized: false},
      auth: {
        username: this.esConfig.username,
        password: this.esConfig.password
      }
    };
  }
}
