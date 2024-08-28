import { Component, Input, OnInit, inject } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { BuildsState } from 'src/enum/build-state';
import { PipelineApiService } from 'src/services/pipeline-api.service';



@Component({
  selector: 'app-builds-count-and-state',
  templateUrl: './builds-count-and-state.component.html',
  styleUrls: ['./builds-count-and-state.component.scss']
})
export class BuildsCountAndStateComponent implements OnInit{

  @Input() buildsCount  = 0;
  @Input() buildsState: BuildsState = BuildsState.UNKNOWN;

  private count$$ = new BehaviorSubject<number>(0);
  count$ = this.count$$.asObservable();

  apiService = inject(PipelineApiService);

  ngOnInit(): void {
    if(this.buildsState === BuildsState.FAIL || this.buildsState === BuildsState.RUN){
      const field = this.buildsState === BuildsState.FAIL ? 'failure' : 'success';
      this.count$ = this.apiService.data$.pipe(
         map(res => res.aggregations.status_count.buckets[field].doc_count)
      )
    }
  }
}
