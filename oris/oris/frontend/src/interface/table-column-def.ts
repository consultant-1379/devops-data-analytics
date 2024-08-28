import { Format } from "src/app/types/custom-types.type";

export interface ColumnDef {
    columnDef: string;
    header: string,
    value: unknown,
    type: Format, 
    cell: (cell: { [key: string] : any }) => any
}