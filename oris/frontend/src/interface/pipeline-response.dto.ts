

export interface PipelineResponseDTO<T> {
    _index: string,
    totalPipelines: number,
    pipelines: PipelineData<T>[],
    aggregations: Aggregations
}

export interface PipelineData<T> {
    pipeline: PipelineResponseTrimmed,
    stage: T,
    jira?: string
}

export interface StageResponseTrimmed {
    id: string;
    status: string;
    name: string;
    jobUrl: string;
    startTime: Date;
    endTime: Date;
    duration: number;
}

export interface AppData {
    appName: string;
    appRevision: string;
    appUpgradedFrom: string;
    appUpgradedTo: string;
    appDuration: number;
  }
  
  export interface StageResponseFromUpgradeAppsIndex extends StageResponseTrimmed, AppData{
  
  }

export interface PipelineResponseTrimmed {
  id: string;
  status: string;
  application: string;
  name: string;
  buildNumber: number;
  url: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  service: string;
}


export interface Aggregations {
    status_count : {
        buckets : Record<string, { doc_count: number }>
    }
}
