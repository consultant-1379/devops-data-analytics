import { RequestState } from "src/enum/request-state.enum";
import { AppWiseTeams } from "../types/custom-types.type";

export interface DataByTimePeriod {
    totalPipelineDeliveries: number,
    totalSuccessCount: number,
    totalFailedCount: number,
    passRate: number,
    deliveriesColor: string,
    passRateColor: string
  }
  
  export interface ApplicationData {
    applicationName: string,
    appLabel: string,
    teamCount: number,
    twentyDaysData: DataByTimePeriod,
    yesterdayData: DataByTimePeriod,
  }
  
  export interface AppProductStagingResponse {
    appAndTeams?: AppWiseTeams
    eicAppStaging: Array<ApplicationData>;
    eicProductStaging: Array<ApplicationData>;
  }

  // ------ Team info ------
  export interface Team {
    teams: TeamData[] | string[];
  }

  export interface TeamData {
    teamName: string,
    microservices?: string[]
  }

  export interface ResponseState<T> {
    response?: T;
    state: RequestState
  }