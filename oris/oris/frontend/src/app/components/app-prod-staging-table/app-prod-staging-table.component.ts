import { DecimalPipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppProductStagingResponse, ApplicationData, DataByTimePeriod } from 'src/app/interfaces/app-product-stage.interface';
import { AppRowData } from 'src/app/interfaces/app-row-data.interface';
import { DeliveryCell, PassrateCell } from 'src/app/interfaces/cell.interface';
import { ColumnDef } from 'src/app/interfaces/column.interface';
import { DataColumnDef } from 'src/app/interfaces/data-column.interface';
import { SubColumnDef } from 'src/app/interfaces/sub-column.interface';
import { AppAndProductStagingService } from 'src/app/services/app-and-product-staging.service';
import { AppWiseTeams } from 'src/app/types/custom-types.type';
import { apps } from 'src/constants/apps.constant';
import { columnDefs, finalColumns, subColumnDefs } from 'src/constants/table-columns.constant';
import { RequestState } from 'src/enum/request-state.enum';

@Component({
  selector: 'app-app-prod-staging-table',
  templateUrl: './app-prod-staging-table.component.html',
  styleUrls: ['./app-prod-staging-table.component.scss']
})
export class AppProdStagingTableComponent implements AfterViewInit, OnInit {

  dataSource: MatTableDataSource<AppRowData>;
  @ViewChild(MatSort) sort!: MatSort;
  state = RequestState;
  appTeams : AppWiseTeams = apps;
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
        if(res.response.appAndTeams){
          this.appTeams = res.response.appAndTeams;
        }
        this.dataSource.data = this.mapDataToTableRows(res.response);
      }
    }); 
  }

  ngAfterViewInit() {
    this.applySorting();
    //TODO: apply filter if needed
  }

  columns = this.allColumns.map((col) => {
    const isDelivery = col.includes('Deliveries');
    const isApp = col.includes('application');
    return <DataColumnDef>{
      matColumnDef: col,
      ...(isApp
        ? {
            headerName: '(x) X shows team count per application',
            switchCase: 'application',
          }
        : isDelivery
        ? { headerName: 'Deliveries', switchCase: 'deliveries' }
        : { headerName: 'Pass rate', switchCase: 'default' }),
    };
  });

  deliveryPrefixes = this.allColumns.filter(col => col.includes('Deliveries'));
  passratePrefixes = this.allColumns.filter(col => col.includes('Passrate'));
  displayedColumns = this.columns.map((column) => column.matColumnDef);
  columnHeaders = this.columnDefs.map((column) => column.matColumnDef);
  subColumnHeaders = this.subColumnDefs.map((column) => column.matColumnDef);

  handlePassRateSorting(passRate: string){
    return parseFloat(passRate.replace('%', ''));
  }

  isDeliveryProperty(property: string): property is 'asDeliveriesY' | 'asDeliveries20' | 'psDeliveriesY' | 'psDeliveries20' {
    return this.deliveryPrefixes.includes(property);
  }
  
  isPassrateProperty(property: string): property is 'asPassrateY' | 'asPassrate20' | 'psPassrateY' | 'psPassrate20' {
    return this.passratePrefixes.includes(property);
  }

  applySorting() {
    this.dataSource.sortingDataAccessor = (data, property) => {
      if (this.isDeliveryProperty(property)) {
        return data[property].totalDeliveries;
      } else if (this.isPassrateProperty(property)) {
        return this.handlePassRateSorting(data[property].passRate);
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

  getTeamnames(appName: string, leftRow: ApplicationData){
    let teamNames = ((this.appTeams[appName] ?? {}).teams ?? []) as string[];
    const diff= Math.abs(teamNames.length - leftRow.teamCount);
    
    if(leftRow.teamCount > teamNames.length){
      teamNames = [...teamNames, ...(new Array<string>(diff).fill('Unknown')) ];
    }

    return {teamNames, count: teamNames.length};
  }

  mapDataToTableRows = (res: AppProductStagingResponse) => {
    const leftRows: Record<string, ApplicationData> = this.rowMapperHelper(res.eicAppStaging);
    const rightRows: Record<string, ApplicationData> = this.rowMapperHelper(res.eicProductStaging);

    return Object.keys(leftRows).reduce((acc, key) => {
      const leftRow = leftRows[key];
      const rightRow = rightRows[key];
      const appName = leftRow.appLabel;

      const {teamNames, count} =  this.getTeamnames(appName, leftRow);
      
      return <AppRowData[]>[
        ...acc,
        {
          application: { name: appName, count, teamNames},
          ...this.leftRowCells(leftRow),
          ...this.rightRowCells(rightRow)
        },
      ];
    }, [] as AppRowData[]);
  };

  leftRowCells(row: ApplicationData) {
    const { yeserdayCells, twentyDayCells } = this.mergeCellsDatewise(row);
    
    return {
      asDeliveriesY : yeserdayCells.deliveryCell,
      asPassrateY: yeserdayCells.passrateCell,
      asDeliveries20:  twentyDayCells.deliveryCell,
      asPassrate20: twentyDayCells.passrateCell
    }
  }

  rightRowCells(row: ApplicationData) {
    const { yeserdayCells, twentyDayCells } = this.mergeCellsDatewise(row);
    
    return {
      psDeliveriesY : yeserdayCells.deliveryCell,
      psPassrateY: yeserdayCells.passrateCell,
      psDeliveries20:  twentyDayCells.deliveryCell,
      psPassrate20: twentyDayCells.passrateCell
    }
  }

  mergeCellsDatewise(row: ApplicationData){

    if(row) {
      return { yeserdayCells: this.setBothTogether(row.yesterdayData), twentyDayCells: this.setBothTogether(row.twentyDaysData) }
    }

    const emptyCells = this.emptyCells();
    return { yeserdayCells: emptyCells, twentyDayCells: emptyCells };
  }

  setBothTogether(rowByTime: DataByTimePeriod) : { deliveryCell: DeliveryCell, passrateCell: PassrateCell } {
    return {
      deliveryCell: {
        totalDeliveries: rowByTime.totalPipelineDeliveries,
        successfulDeliveries: rowByTime.totalSuccessCount,
        failedDeliveries: rowByTime.totalFailedCount,
        class: this.colorClassGenerator(rowByTime.deliveriesColor),
      },
      passrateCell: {
        passRate: this.decimalPipe.transform(rowByTime.passRate, '1.0-2') + '%',
        class: this.colorClassGenerator(rowByTime.deliveriesColor),
      }
    }
  }

  //Utils
  colorClassGenerator(color: string){
    return color === 'GREEN' ? 'success color-green' : color === 'RED' ? 'failure color-red' : '';
  }

  emptyCells(): { deliveryCell: DeliveryCell, passrateCell: PassrateCell }  {
    return {  
      deliveryCell :  {
        totalDeliveries: '-',
        successfulDeliveries: '',
        failedDeliveries: '',
        class: '',
      },
      passrateCell : {
        passRate: '-', class: '' 
     }
    }
  }

  rowMapperHelper(applicationData: ApplicationData[]): Record<string, ApplicationData> {
    return applicationData.reduce((acc, val) => {
      const appStageRow: ApplicationData = {
        applicationName: val.applicationName,
        appLabel: val.appLabel,
        teamCount: val.teamCount,
        twentyDaysData: val.twentyDaysData,
        yesterdayData: val.yesterdayData,
      };
      return (acc = { ...acc, [val.appLabel]: appStageRow });
    }, {});
  }

}