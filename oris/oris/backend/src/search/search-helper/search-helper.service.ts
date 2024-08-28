import { Injectable } from '@nestjs/common';
import { PipelineData, PipelineResponseDTO, T } from 'src/dto/search-dto/pipeline-response.dto';
import { SearchResult } from 'src/interfaces/search-result.response';


@Injectable()
export class SearchHelperService {
    
    constructor() {}

    createPipelinesResponseDTO(_index: string, searchResult: SearchResult<T>) : PipelineResponseDTO<T> {

      const {hits, aggregations} = searchResult;
      let pipelines :  PipelineData<T>[]  = [] ;

      hits.hits.forEach( ({_source}) => {
        pipelines = [...pipelines, _source];
      } )
     
      return <PipelineResponseDTO<T>>{
        _index,
        totalPipelines: 0,
        pipelines,
        aggregations
      };
    }

    
  getPastTimestamp(timeFilter: string) : { current: number, past: number } {
    const now = new Date();
    const result = { current: now.getTime(), past: now.getTime() };
    
    if(timeFilter === 'today'){
      now.setHours(0,0,0,0);
      return { ...result, past: now.getTime() };
    }

    const [value, format] = timeFilter.split('-');
    const valNum = Number(value);
    if(isNaN(valNum)) throw new Error('Number Format Error');

    switch(format) {
      case 'minute':
        now.setMinutes(now.getMinutes() - valNum);
        break;
      case 'hour':
        now.setHours(now.getHours() -  valNum);
        break;
      case 'day':
        now.setDate(now.getDate() - valNum);
        break;
      case 'week':
        now.setDate(now.getDate() - ( 7 * valNum ));
        break;
      case 'month':
        now.setMonth(now.getMonth() - valNum);
        break;
      case 'year':
        now.setFullYear(now.getFullYear() - valNum);
        break;
      default:
        throw new Error('Invalid type');
    }

    return { ...result, past: now.getTime() };

  }
}
