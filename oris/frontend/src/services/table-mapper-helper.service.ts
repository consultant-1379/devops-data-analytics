import { Injectable } from '@angular/core';
import { TableHeaders } from 'src/constants/table-headers';
import { PipelineData, PipelineResponseTrimmed } from 'src/interface/pipeline-response.dto';
import { ColumnDef } from 'src/interface/table-column-def';
import { CustomTableType } from 'src/interface/table-template-state';
import { Format, T } from '../types/custom-types.type';

@Injectable({
  providedIn: 'root'
})
export class TableMapperHelperService {

  createTableData(pipelines : PipelineData<T>[]) : CustomTableType {
    if(pipelines.length === 0) {
      return { DATA: [], columns: [], displayedColumns: [] };
    }
    
    const DATA = pipelines.map( ({pipeline, stage}) => {
      
      const modifiedColumns : Record<string, ColumnDef> = {};
      this.mapDataToColumns('p', 'Pipeline', modifiedColumns, pipeline);
      this.mapDataToColumns('s', 'Stage', modifiedColumns, stage);

      return modifiedColumns;
    } );

    const columns= Object.values(DATA[0]).map(c => <ColumnDef>{ columnDef: c.columnDef, header: c.header, type: c.type, cell: c.cell } );
    const displayedColumns = ['pid', 'purl', 'sid', 'sjobUrl', 'sappName',  'sappUpgradedFrom', 'sappUpgradedTo', 'sappRevision', 'sappDuration'];

    return {DATA, columns, displayedColumns };
    
  }

  createTableData2(pipelines : PipelineData<T>[], jiraFlag = false)  {

    const DATA = pipelines.map( ({pipeline, stage, jira}) => {
      
      const modifiedColumns : Record<string, ColumnDef> = {};
      
      if(jiraFlag){
        modifiedColumns['jira'] = {
          columnDef: 'jira',
          header: 'Jira',
          value: jira ?? 'no-jira',
          type: 'edit',
          cell: (row) => row['jira'].value
        }
      }
      this.mapDataToColumns('p', 'Pipeline', modifiedColumns, pipeline);
      this.mapDataToColumns('s', 'Stage', modifiedColumns, stage);

      return modifiedColumns;
    } );

    return DATA ;
    
  }
    
  private mapDataToColumns(xKey: string, prefix: string, modifiedColumns : Record<string, ColumnDef>,  dataObj : T | PipelineResponseTrimmed ) : void {
    Object.keys(dataObj).forEach(key => {
      const newKey = xKey + key;
      const value = dataObj[key as keyof typeof dataObj];
      const type : Format = key.toLowerCase().includes('url') ?  'url' : 'text';
      modifiedColumns[newKey] = {
        columnDef: newKey,
        header : TableHeaders[newKey] ?? `${prefix} ${key}`,
        value,
        type,
        cell: (row) => row[newKey].value }
    });
  }


}
