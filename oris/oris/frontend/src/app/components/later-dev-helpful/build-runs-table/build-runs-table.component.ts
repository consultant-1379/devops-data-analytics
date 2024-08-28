import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { PipelineApiService } from 'src/app/services/pipeline-api.service';
import { ColumnDef } from 'src/interface/table-column-def';
import { TableState } from 'src/interface/table-template-state';

export enum Status {
  LOADING,
  LOADED,
  ERROR
}

@Component({
  selector: 'app-build-runs-table',
  templateUrl: './build-runs-table.component.html',
  styleUrls: ['./build-runs-table.component.scss']
})
export class BuildRunsTableComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatInput) input!: MatInput;

  private dataSource = new MatTableDataSource<Record<string, ColumnDef>>();
  tableData$ !: Observable<MatTableDataSource<Record<string, ColumnDef>>> ;
  columns : ColumnDef[] = []
  displayedColumns : string[] = [];

  readonly status = Status;
  
  tableState$ !: Observable<TableState<MatTableDataSource<Record<string, ColumnDef>>>>;
  
  private apiService = inject(PipelineApiService);

  ngOnInit(): void {
        this.tableState$ = this.apiService.appsData$;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  }
