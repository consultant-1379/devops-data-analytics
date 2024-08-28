import { ColumnDef } from "src/interfaces/column.interface";
import { SubColumnDef } from "src/interfaces/sub-column.interface";

export enum TableHeader {
  APPLICATION = 'Application',
  APP_STAGING = 'Application Staging',
  PRODUCT_STAGING = 'Product Staging',
}

export enum TableSubHeader {
  YESTERDAY = 'Yesterday',
  DAYS_APART_20 = '20 Days'
}

//Order matters here
export const finalColumns = [
    {colDef: 'application' , id: 'App'},
    {colDef: 'asDeliveriesY', id: 'Delivery'},
    {colDef: 'asCFRY', id: 'CFR'},
    {colDef: 'asDeliveries20', id: 'Delivery'},
    {colDef: 'asCFR20', id: 'CFR'},
    {colDef: 'asLTC20', id: 'LTC'},
    {colDef: 'psDeliveriesY', id: 'Delivery'},
    {colDef: 'psCFRY', id: 'CFR'},
    {colDef: 'psDeliveries20', id: 'Delivery'},
    {colDef: 'psCFR20', id: 'CFR'},
    {colDef: 'psLTC20', id: 'LTC'},
  ];

// export const 

export const columnDefs: ColumnDef[] = [
  {
    matColumnDef: 'first-header-row-none-group',
    isColspan: false,
    span: 2,
    headerName: TableHeader.APPLICATION,
  },
  {
    matColumnDef: 'first-header-row-app-group',
    isColspan: true,
    span: 5,
    headerName: TableHeader.APP_STAGING,
  },
  {
    matColumnDef: 'first-header-row-product-group',
    isColspan: true,
    span: 5,
    headerName: TableHeader.PRODUCT_STAGING,
  },
];

export const subColumnDefs: SubColumnDef[] = [
  {
    matColumnDef: 'second-header-row-app-first-group',
    colspan: 2,
    headerName: TableSubHeader.YESTERDAY,
  },
  {
    matColumnDef: 'second-header-row-app-second-group',
    colspan: 3,
    headerName: TableSubHeader.DAYS_APART_20,
  },
  {
    matColumnDef: 'second-header-row-product-first-group',
    colspan: 2,
    headerName: TableSubHeader.YESTERDAY,
  },
  {
    matColumnDef: 'second-header-row-product-second-group',
    colspan: 3,
    headerName: TableSubHeader.DAYS_APART_20,
  },
];
