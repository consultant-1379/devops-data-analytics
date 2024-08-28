import { StageResponseFromUpgradeAppsIndex, StageResponseTrimmed } from "src/interface/pipeline-response.dto";

export type EitherOf = string | number ;
export type T = StageResponseTrimmed | StageResponseFromUpgradeAppsIndex;
export type Format = 'text' | 'url' | 'edit'