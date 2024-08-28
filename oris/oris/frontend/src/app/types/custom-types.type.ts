import { StageResponseFromUpgradeAppsIndex, StageResponseTrimmed } from "src/interface/pipeline-response.dto";
import { Team } from "../interfaces/app-product-stage.interface";

export type AppWiseTeams = { [key : string] : Team }
export type EitherOf = string | number ;
export type T = StageResponseTrimmed | StageResponseFromUpgradeAppsIndex;
export type Format = 'text' | 'url' | 'edit'