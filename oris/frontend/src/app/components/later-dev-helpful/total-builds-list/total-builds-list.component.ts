import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { PipelineApiService } from 'src/services/pipeline-api.service';

export interface Build{
  stageId: string;
  stageStartTime: string,
  pipelineStartTime: string,
  pipelineId: string,
  color: string;
  value: string;
}

// const colors = [ 'red', 'green', 'orange', 'black' ];
type Color = Record<string,  string>
const colors : Color  = {
  'SUCCEEDED' : 'green',
   'TERMINAL' : 'red',
   'FAILED_CONTINUE': 'red',
   'BLOCKED' : 'black',
   'RUNNING' : 'orange',
   'CANCELED' : 'black'
} 

@Component({
  selector: 'app-total-builds-list',
  templateUrl: './total-builds-list.component.html',
  styleUrls: ['./total-builds-list.component.scss'],
})

export class TotalBuildsListComponent implements OnInit {

  builds$$ = new BehaviorSubject<Build[]>([]);
  builds$ = this.builds$$.asObservable();
  setOpacity = false;
  hoveredCell = -1;
  activeCell = '0';

  constructor(protected apiService: PipelineApiService){

  }
  ngOnInit(): void {
    this.builds$ = this.apiService.data$.pipe(
      map(res => {
          
          const pipelinesData = res.pipelines;
          return pipelinesData.map( (pipelineData) => {
            const {stage, pipeline} = pipelineData;
              return <Build>{
                stageId: stage.id.slice(stage.id.length - 6),
                stageStartTime: new Date(stage.startTime).toLocaleString(),
                pipelineId: pipeline.id,
                pipelineStartTime: new Date(pipeline.startTime).toLocaleString(),
                value : pipeline.id.slice(pipeline.id.length - 6),
                color: colors[pipelineData.pipeline.status] 
              }
            })
          }),
      tap(pipelines => {
            this.activeCell = pipelines[0]?.pipelineId ?? '-1';
            this.apiService.updatePipelineSelections(this.activeCell);
      })
    );
  }

  trackByFn(index: number, pipeline: Build){
    return pipeline.value
  }

  YouClickedMe(pipelineId: string){
    this.activeCell = pipelineId;
    this.apiService.updatePipelineSelections(pipelineId);
  }

  caller(index: number){
    this.hoveredCell = index;
  }

}
