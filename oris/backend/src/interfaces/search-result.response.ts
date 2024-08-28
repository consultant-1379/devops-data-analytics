import { PipelineResponseTrimmed } from "src/interfaces/source-body.trimmed";

export interface SearchResult<T> {
  hits: Hits<T>
  aggregations: Aggregations
}

export interface Hits<T> {
      total: {
        value: number;
      },
      hits: Array<SourceResultBody<T>>;
}

export interface Aggregations {
  status_count : {
      buckets : Record<string, { doc_count: number }>
  }
}

export interface SourceResultBody<T> {
    _source : {
      pipeline: PipelineResponseTrimmed;
      stage: T;
    }
  }
  
