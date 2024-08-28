import { RequestState } from "src/enum/request-state.enum";

export interface DataByTimePeriod {
    totalPipelineDeliveries: number,
    totalSuccessCount: number,
    totalFailedCount: number,
    cfr: number,
    deliveriesColor: string,
    cfrColor: string
    ltc?: number
    ltcColor?: string
  }
  
  export interface ApplicationData {
    applicationName: string[],
    appLabel: string,
    teams: string[],
    teamCount: number,
    twentyDaysData: DataByTimePeriod,
    yesterdayData: DataByTimePeriod,
  }
  
  export interface AppProductStagingResponse {
    eicAppStaging: Array<ApplicationData>;
    eicProductStaging: Array<ApplicationData>;
  }


  export interface ResponseState<T> {
    response?: T;
    state: RequestState
  }