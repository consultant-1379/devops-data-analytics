import { PipelineResponseTrimmed, StageResponseFromUpgradeAppsIndex, StageResponseTrimmed } from "src/interfaces/source-body.trimmed";
import { Aggregations } from "../../interfaces/search-result.response";

export interface PipelineResponseDTO<T> {
    _index: string,
    totalPipelines: number,
    pipelines: PipelineData<T>[],
    aggregations: Aggregations
}

export interface PipelineData<T> {
    pipeline: PipelineResponseTrimmed,
    stage: T
}

export type T = StageResponseTrimmed | StageResponseFromUpgradeAppsIndex;








