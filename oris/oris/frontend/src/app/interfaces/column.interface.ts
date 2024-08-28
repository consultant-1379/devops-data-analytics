import { TableHeader } from "src/constants/table-columns.constant";

export interface ColumnDef {
    matColumnDef: string,
    isColspan: boolean,
    span: number,
    headerName: TableHeader
}