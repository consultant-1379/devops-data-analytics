import { Format } from "src/types/custom-types.type";

export interface ColumnDef {
    columnDef: string;
    header: string,
    value: unknown,
    type: Format, 
    cell: (cell: { [key: string] : any }) => any
}