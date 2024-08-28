import { ColumnDef } from "./table-column-def";

export interface TableState<T> {
    state: Status,
    message: string,
    data ?: T;
    dummy?: unknown
    columns ?: ColumnDef[],
    displayedColumns ?: string[]


}

export enum Status {
    LOADING,
    LOADED,
    ERROR
}

export interface CustomTableType {
    DATA : Record<string, ColumnDef>[],
    columns: ColumnDef[],
    displayedColumns: string[]
  
  }