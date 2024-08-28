import { ColumnDef } from "src/app/interfaces/column.interface";
import { SubColumnDef } from "src/app/interfaces/sub-column.interface";

export enum TableHeader {
  APPLICATION = 'Application',
  APP_STAGING = 'App Staging',
  PRODUCT_STAGING = 'Product Staging',
}

export enum TableSubHeader {
  YESTERDAY = 'Yesterday',
  DAYS_APART_20 = '20 Days'
}

//Order matters here
export const finalColumns = [
    'application',
    'asDeliveriesY',
    'asPassrateY',
    'asDeliveries20',
    'asPassrate20',
    'psDeliveriesY',
    'psPassrateY',
    'psDeliveries20',
    'psPassrate20',
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
    span: 4,
    headerName: TableHeader.APP_STAGING,
  },
  {
    matColumnDef: 'first-header-row-product-group',
    isColspan: true,
    span: 4,
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
    colspan: 2,
    headerName: TableSubHeader.DAYS_APART_20,
  },
  {
    matColumnDef: 'second-header-row-product-first-group',
    colspan: 2,
    headerName: TableSubHeader.YESTERDAY,
  },
  {
    matColumnDef: 'second-header-row-product-second-group',
    colspan: 2,
    headerName: TableSubHeader.DAYS_APART_20,
  },
];
