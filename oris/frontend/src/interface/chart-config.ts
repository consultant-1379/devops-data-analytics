import { ChartTypeEnum } from "src/enum/chart-type";
import { JobData } from "./job-data";

export interface ChartConfig{
    id: string ;
    jobData: JobData;
    chartType: ChartTypeEnum ;
    backgroundColor: string[] ;
    borderColor: string[] ;
}