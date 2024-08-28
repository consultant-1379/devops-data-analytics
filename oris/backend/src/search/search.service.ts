import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ElasticSearchConfig } from 'src/custom-config/custom-config';
import { SearchResult } from 'src/interfaces/search-result.response';
import { StageResponseFromUpgradeAppsIndex, StageResponseTrimmed } from 'src/interfaces/source-body.trimmed';
import { COMBINED_SOURCE, COMBINED_SOURCE_FOR_APPS_DATA, HELM_UPGRADE_STAGE, STAGE_STATUS_KEYWORDS } from 'src/utils/search-query.constants';
import { SearchHelperService } from './search-helper/search-helper.service';


@Injectable()
export class SearchService {

  private readonly indices: { primary: string,  secondary: string, test: string };

  constructor(
    @Inject(ElasticSearchConfig.KEY) private readonly esConfig: ConfigType<typeof ElasticSearchConfig>,
    private readonly elasticsearchService: ElasticsearchService,
    private readonly searchHelperService: SearchHelperService) 
    {
      this.indices = { primary: esConfig.primaryIndex, secondary: esConfig.secondaryIndex, test: esConfig.testIndex }
    }

    

/// Primary Index call
  async getAllUpgradePipelines(timeFilter: string){
    const timeRange = this.searchHelperService.getPastTimestamp(timeFilter);

    const result : SearchResult<StageResponseTrimmed> = (await this.elasticsearchService.search({
      index: this.indices.primary,
      size: 300,
      _source: COMBINED_SOURCE,
      query: {
        bool: {
          must: [
            { term: {"stage.name.keyword":  HELM_UPGRADE_STAGE} },
            { terms: {"stage.status.keyword": STAGE_STATUS_KEYWORDS} }
          ],
          filter: [
            {
              range: {
                "pipeline.startTime": {
                  gte: timeRange.past,
                  lte: timeRange.current,
                },
              }
            }
          ]
        }
      },
      aggs: {
        "status_count": {
          filters: {
            filters: {
              "success": {
                term: {
                  "stage.status.keyword": "SUCCEEDED"
                }
              },
              "failure": {
                term: {
                  "stage.status.keyword": "FAILED_CONTINUE"
                }
              },
            }
          }
        }
      },
      sort: [
        { "pipeline.startTime": { order: "desc" } }
      ],
    })) as SearchResult<StageResponseTrimmed>;
    return this.searchHelperService.createPipelinesResponseDTO(this.indices.primary, result);
  }

  async getDocs(index: string) {
    const result : SearchResult<StageResponseFromUpgradeAppsIndex> = (await this.elasticsearchService.search({
      index: index,
      size: 50,
      _source: [...COMBINED_SOURCE_FOR_APPS_DATA, "jira"],
      query: {
        match_all: {}
      },
    })) as SearchResult<StageResponseFromUpgradeAppsIndex>;
    return this.searchHelperService.createPipelinesResponseDTO(index, result);
  }

  /// Secondary Index call
  async getAppsDataByPipelineIds(pipelineIds: string[]){

    const result : SearchResult<StageResponseFromUpgradeAppsIndex> = (await this.elasticsearchService.search({
      index: this.indices.secondary,
      size: 300,
      _source: COMBINED_SOURCE_FOR_APPS_DATA,
      query: {
        bool: {
          must: [
            { terms: {"pipeline.id.keyword":  pipelineIds} },
          ],
        }
      },
    })) as SearchResult<StageResponseFromUpgradeAppsIndex>;
    
    return this.searchHelperService.createPipelinesResponseDTO(this.indices.secondary, result);
  }

  /// Test Index call
  async updateJiraIds(jiraId : string, pipelineId: string){

    const result = await this.elasticsearchService.updateByQuery(
      {
        index: this.indices.test,
        refresh: true,
        script: {
          source: `ctx._source.jira = '${jiraId}'`,
          lang: "painless"
        },
        query: {
          bool: {
            must: [
              { terms: {"pipeline.id.keyword":  [pipelineId]} },
            ],
          }
        }

      }
    );
    
    return result;

    // return { jiraId, pipelineId };
  }

}
