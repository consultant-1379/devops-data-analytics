import { TableSubHeader } from "src/constants/table-columns.constant";

export interface SubColumnDef {
    matColumnDef: string,
    colspan: number
    headerName: TableSubHeader
  }
  