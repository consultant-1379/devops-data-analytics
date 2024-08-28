import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, catchError, delay, map, of, shareReplay, startWith, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PipelineResponseDTO, StageResponseFromUpgradeAppsIndex, StageResponseTrimmed } from 'src/interface/pipeline-response.dto';
import { ColumnDef } from 'src/interface/table-column-def';
import { Status, TableState } from 'src/interface/table-template-state';
import { TableMapperHelperService } from './table-mapper-helper.service';



@Injectable({
  providedIn: 'root'
})
export class PipelineApiService {

  private readonly url = environment.apiUrl;
  

  private tableMapperService = inject(TableMapperHelperService);
  private http = inject(HttpClient);


  private dataSource = new MatTableDataSource<Record<string, ColumnDef>>();
  private dataSource2 = new MatTableDataSource<Record<string, ColumnDef>>();

  timeChange = new Subject<string>();
  timeChange$ = this.timeChange.asObservable();
  private pipelineTracker$$ = new Subject<string>();
  pipelineTarcker$ = this.pipelineTracker$$.asObservable();

    
  data$ = this.timeChange$.pipe(
    switchMap(input => {
      return this.http.get<PipelineResponseDTO<StageResponseTrimmed>>(`${this.url}/search/sample`, {
        params: new HttpParams().set('timeFilter', input)
      });
    }),
    shareReplay(1),
  );


  appsData$ : Observable<TableState<MatTableDataSource<Record<string, ColumnDef>>>>= this.pipelineTarcker$.pipe(
    switchMap(selectedPipeline => {
        return this.http.post<PipelineResponseDTO<StageResponseFromUpgradeAppsIndex>>(`${this.url}/search/apps`, {pipelineIds: [selectedPipeline]})
        .pipe(
            delay(2000),
            map(res => res.pipelines),
            map(res =>  {
              const { DATA, columns, displayedColumns } = this.tableMapperService.createTableData(res);
              this.dataSource.data = DATA;
              return {
                state: Status.LOADED,
                message: 'Done',
                data: this.dataSource,
                columns: columns,
                displayedColumns: displayedColumns
              }
            }),
            startWith({
              state: Status.LOADING,
              message: 'Loading...'
            }),
            catchError(err => {
              return of({
                state: Status.ERROR,
                message: 'Error occured' + err
              })
            }),
            );
    }),
  );


  docs$ = this.http.get<PipelineResponseDTO<StageResponseFromUpgradeAppsIndex>>(`${this.url}/search/get-docs?index=index-temp`)
  .pipe(
      delay(2000),
      map(res => res.pipelines),
      map(res =>  {
        const DATA = this.tableMapperService.createTableData2(res, true);
        return {
          state: Status.LOADED,
          message: 'Done',
          dummy: DATA,
        }
      }),
      );

  
  updatePipelineSelections(updatePipeline: string) : void{
    this.pipelineTracker$$.next(updatePipeline);
  }


}
