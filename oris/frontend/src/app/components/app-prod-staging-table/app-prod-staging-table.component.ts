import { DecimalPipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { columnDefs, finalColumns, subColumnDefs } from 'src/constants/table-columns.constant';
import { RequestState } from 'src/enum/request-state.enum';
import { AppProductStagingResponse, ApplicationData, DataByTimePeriod } from 'src/interfaces/app-product-stage.interface';
import { AppRowData } from 'src/interfaces/app-row-data.interface';
import { CFRCell, DeliveryCell, LTCCell } from 'src/interfaces/cell.interface';
import { ColumnDef } from 'src/interfaces/column.interface';
import { DataColumnDef } from 'src/interfaces/data-column.interface';
import { SubColumnDef } from 'src/interfaces/sub-column.interface';
import { AppAndProductStagingService } from 'src/services/app-and-product-staging.service';

@Component({
  selector: 'app-app-prod-staging-table',
  templateUrl: './app-prod-staging-table.component.html',
  styleUrls: ['./app-prod-staging-table.component.scss']
})
export class AppProdStagingTableComponent implements AfterViewInit, OnInit {

  dataSource: MatTableDataSource<AppRowData>;
  @ViewChild(MatSort) sort!: MatSort;
  state = RequestState;
  columnDefs: ColumnDef[] = columnDefs;
  subColumnDefs: SubColumnDef[] = subColumnDefs
  allColumns = finalColumns;
  
  private res$ = this.apiService.realtimeRes$;
  appState$ = this.apiService.appState$;

  constructor(private apiService: AppAndProductStagingService, private decimalPipe: DecimalPipe) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.res$.subscribe((res) => {
      if(res.state === RequestState.LOADED && res.response){
        this.dataSource.data = this.mapDataToTableRows(res.response);
      }
    }); 
  }

  ngAfterViewInit() {
    this.applySorting();
    //TODO: apply filter if needed
  }

  getSubHeaders(col : {colDef: string, id: string}) : { headerName: string, switchCase: string, tooltipTxt: string } {
    switch(col.id) {
      case 'App' : return { headerName: '(x) X shows team count per application', switchCase: 'application', tooltipTxt: 'Application & Team count'}
      case 'Delivery': return { headerName: 'Deliveries', switchCase: 'deliveries', tooltipTxt: 'Color coding relative to'}
      case 'CFR': return { headerName: 'CFR', switchCase: 'cfr', tooltipTxt: 'Change Failure Rate' }
      case 'LTC': return { headerName: 'LTC', switchCase: 'ltc', tooltipTxt: 'Lead Time for Changes' }
      default: return { headerName: 'None', switchCase: 'default', tooltipTxt: '' }
    }
  }

  columns = this.allColumns.map((col) => {
    return <DataColumnDef> {
      matColumnDef: col.colDef,
      ...this.getSubHeaders(col)
    }
  });

  deliveryPrefixes = this.allColumns.filter(col => col.id === 'Delivery');
  cfrPrefixes = this.allColumns.filter(col => col.id === 'CFR');
  displayedColumns = this.columns.map((column) => column.matColumnDef);
  // totalRowColumns = this.displayedColumns
  columnHeaders = this.columnDefs.map((column) => column.matColumnDef);
  subColumnHeaders = this.subColumnDefs.map((column) => column.matColumnDef);

  handleCFRSorting(cfr: string){
    return parseFloat(cfr.replace('%', ''));
  }

  handleLTCSorting(ltc: string){
    return parseFloat(ltc.replace('m', ''));
  }

  isDeliveryProperty(property: string): property is 'asDeliveriesY' | 'asDeliveries20' | 'psDeliveriesY' | 'psDeliveries20' {
    return this.deliveryPrefixes.map(col => col.colDef).includes(property);
  }
  
  isCFRProperty(property: string): property is 'asCFRY' | 'asCFR20' | 'psCFRY' | 'psCFR20' {
    return this.cfrPrefixes.map(col => col.colDef).includes(property);
  }

  isLTCProperty(property: string): property is 'asLTC20' | 'psLTC20' {
    return property === 'asLTC20' || property === 'psLTC20'
  }

  applySorting() {
    this.dataSource.sortingDataAccessor = (data, property) => {
      if (this.isDeliveryProperty(property)) {
        return data[property].totalDeliveries;
      } else if (this.isCFRProperty(property)) {
        return this.handleCFRSorting(data[property].cfr);
      } else if (this.isLTCProperty(property)) {
        return this.handleLTCSorting(data[property].ltc);
      }
      return data['application'].name;
    };
    this.dataSource.sort = this.sort;
  }

  ///TODO: Can be used later when filter enabled
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  mapDataToTableRows = (res: AppProductStagingResponse) => {
    const leftRows: Record<string, ApplicationData> = this.rowMapperHelper(res.eicAppStaging);
    const rightRows: Record<string, ApplicationData> = this.rowMapperHelper(res.eicProductStaging);

    const rowsDataOne = Object.values(leftRows).map(row => {
      const leftRow = leftRows[row.appLabel];
      const rightRow = rightRows[row.appLabel];
      const appName = leftRow.appLabel;
      
      return <AppRowData> {
        application: { name: appName, count: leftRow.teamCount, teamNames: leftRow.teams, type: appName === 'Total' ? 'total' : 'normal'},
        ...this.leftRowCells(leftRow),
        ...this.rightRowCells(rightRow)
      }
    })

    return rowsDataOne

  };

  leftRowCells(row: ApplicationData | undefined) {
    const { yeserdayCells, twentyDayCells } = this.mergeCellsDatewise(row);
    
    return {
      asDeliveriesY : yeserdayCells.deliveryCell,
      asCFRY: yeserdayCells.cfrCell,
      asDeliveries20:  twentyDayCells.deliveryCell,
      asCFR20: twentyDayCells.cfrCell,
      asLTC20: <LTCCell>{
        ltc: row?.twentyDaysData.ltc ? ((this.decimalPipe.transform(row?.twentyDaysData.ltc, '1.0-0') ?? '0')  + 'm') : row?.twentyDaysData.ltc == 0 ? '0m': '-',
        class: this.colorClassGenerator(row?.twentyDaysData.ltcColor ?? ''),
        type: row?.appLabel === 'Total' ? 'total' : 'normal'
      }
    }
  }

  rightRowCells(row: ApplicationData | undefined) {
    const { yeserdayCells, twentyDayCells } = this.mergeCellsDatewise(row);
    
    return {
      psDeliveriesY : yeserdayCells.deliveryCell,
      psCFRY: yeserdayCells.cfrCell,
      psDeliveries20:  twentyDayCells.deliveryCell,
      psCFR20: twentyDayCells.cfrCell,
      psLTC20: <LTCCell>{
        ltc: row?.twentyDaysData.ltc ? ((this.decimalPipe.transform(row?.twentyDaysData.ltc, '1.0-0') ?? '0')  + 'm') : row?.twentyDaysData.ltc == 0 ? '0m': '-',
        class: this.colorClassGenerator(row?.twentyDaysData.ltcColor ?? ''),
        type: row?.appLabel === 'Total' ? 'total' : 'normal'
      }
    }
  }

  mergeCellsDatewise(row: ApplicationData | undefined){

    if(row) {
      return { yeserdayCells: this.setBothTogether(row.appLabel, row.yesterdayData), twentyDayCells: this.setBothTogether(row.appLabel, row.twentyDaysData) }
    }

    const emptyCells = this.emptyCells();
    return { yeserdayCells: emptyCells, twentyDayCells: emptyCells };
  }

  setBothTogether(appLabel: string, rowByTime: DataByTimePeriod) : { deliveryCell: DeliveryCell, cfrCell: CFRCell } {
    const totalDeliveries = appLabel === 'Total' ? this.decimalPipe.transform(rowByTime.totalPipelineDeliveries, '1.0-0') ?? 0 : rowByTime.totalPipelineDeliveries
    return {
      deliveryCell: {
        totalDeliveries,
        successfulDeliveries: rowByTime.totalSuccessCount,
        failedDeliveries: rowByTime.totalFailedCount,
        class: this.colorClassGenerator(rowByTime.deliveriesColor),
      },
      cfrCell: {
        cfr: (this.decimalPipe.transform(rowByTime.cfr, '1.0-0') ?? '0') + '%',
        class: this.colorClassGenerator(rowByTime.cfrColor),
      }
    }
  }

  //Utils
  colorClassGenerator(color: string){
    switch(color){
      case 'GREEN' : return 'success color-green'
      case 'AMBER' : return 'partial color-amber'
      case 'RED' : return 'failure color-red'
      default: return ''
    }
  }

  emptyCells(): { deliveryCell: DeliveryCell, cfrCell: CFRCell }  {
    return {  
      deliveryCell :  {
        totalDeliveries: '-',
        successfulDeliveries: '',
        failedDeliveries: '',
        class: '',
      },
      cfrCell : {
        cfr: '-', class: ''
     }
    }
  }

  rowMapperHelper(applicationData: ApplicationData[]): Record<string, ApplicationData> {
    return applicationData.reduce((acc, val) => {
      const appStageRow: ApplicationData = {
        applicationName: val.applicationName,
        appLabel: val.appLabel,
        teams: val.teams,
        teamCount: val.teamCount,
        twentyDaysData: val.twentyDaysData,
        yesterdayData: val.yesterdayData,
      };
      return (acc = { ...acc, [val.appLabel]: appStageRow });
    }, {});
  }

}