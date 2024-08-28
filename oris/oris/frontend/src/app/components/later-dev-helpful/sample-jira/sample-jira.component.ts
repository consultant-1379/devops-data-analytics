import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, tap } from 'rxjs';
import { PipelineApiService } from 'src/app/services/pipeline-api.service';
import { ColumnDef } from 'src/interface/table-column-def';
import { TableState } from 'src/interface/table-template-state';

export enum Status {
  LOADING,
  LOADED,
  ERROR
}

@Component({
  selector: 'app-sample-jira',
  templateUrl: './sample-jira.component.html',
  styleUrls: ['./sample-jira.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleJiraComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatInput) input!: MatInput;

  dataSource = new MatTableDataSource<Record<string, ColumnDef>>();
  tableState$ !: Observable<TableState<MatTableDataSource<Record<string, ColumnDef>>>>;

  columns : ColumnDef[] = [];
  displayedColumns : string[] = [];
  editorOff = true;

  private apiService = inject(PipelineApiService);

  ngOnInit(): void {

    this.tableState$ = this.apiService.docs$.pipe(tap(res => {
      const DATA = res.dummy;
      this.dataSource.data = DATA;
      this.columns = Object.values(DATA[0]).map(c => c);
      this.displayedColumns = this.columns.map(c => c.columnDef);
    }))

  }

  toggle() {
    this.editorOff = !this.editorOff ;
  }

  trackByFn(index: number, column: ColumnDef){
    console.log(column.columnDef);
    
    return column.columnDef
  }
}
