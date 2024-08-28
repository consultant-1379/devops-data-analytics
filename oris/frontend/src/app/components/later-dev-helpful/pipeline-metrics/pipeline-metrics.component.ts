import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, Renderer2, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { map } from 'rxjs';
import { BuildsState } from 'src/enum/build-state';
import { GridTile } from 'src/interface/grid-tile';
import { GridParent } from 'src/interface/grids-parent';
import { ChartService } from '../../../../services/chart.service';
import { PipelineApiService } from '../../../../services/pipeline-api.service';
import { BuildInfoPortionComponent } from '../build-info-portion/build-info-portion.component';
import { BuildRunsTableComponent } from '../build-runs-table/build-runs-table.component';
import { BuildsCountAndStateComponent } from '../builds-count-and-state/builds-count-and-state.component';
import { AgentUsageLineChartComponent } from '../charts/agent-usage-line-chart/agent-usage-line-chart.component';
import { BuildDurationLineChartComponent } from '../charts/build-duration-line-chart/build-duration-line-chart.component';
import { JobQueuesBarChartComponent } from '../charts/job-queues-bar-chart/job-queues-bar-chart.component';
import { TaskFailuresDonutChartComponent } from '../charts/task-failures-donut-chart/task-failures-donut-chart.component';
import { TotalBuildsListComponent } from '../total-builds-list/total-builds-list.component';


const LEFT_GRIDS_DATA: GridTile[] = [
  {title: 'Upgrade Failures', buildsCount: 5, buildsState: BuildsState.FAIL,  cols: 1, rows: 1, component: BuildsCountAndStateComponent},
  {title: 'Total Upgrades', cols: 1, rows: 2, component: TotalBuildsListComponent},
  {title: 'Total Successful Upgrades', cols: 1, buildsCount: 99, buildsState: BuildsState.RUN, rows: 1, component: BuildsCountAndStateComponent},
  {title: 'Main Branch Build Runs', cols: 2, rows: 1, component: BuildRunsTableComponent}
];

const RIGHT_GRIDS_DATA: GridTile[] = [
  {title: 'Build Duration for Main Branch',  cols: 1, rows: 2, component: BuildDurationLineChartComponent},
  {title: 'Task Failures',  cols: 1, rows: 2, component: TaskFailuresDonutChartComponent},
  {title: 'Builds in Progress',  buildsCount: 7, buildsState: BuildsState.UNKNOWN, cols: 1, rows: 1, component: BuildsCountAndStateComponent},
  {title: 'Build Failures',  buildsCount: 35, buildsState: BuildsState.UNKNOWN, cols: 1, rows: 1, component: BuildsCountAndStateComponent},
  {title: 'Job Queues',  cols: 1, rows: 2, component: JobQueuesBarChartComponent},
  {title: 'Agent Usgae',  cols: 1, rows: 2, component: AgentUsageLineChartComponent}
];

@Component({
  selector: 'app-pipeline-metrics',
  templateUrl: './pipeline-metrics.component.html',
  styleUrls: ['./pipeline-metrics.component.scss']
})
export class PipelineMetricsComponent  implements AfterViewInit{
  @ViewChild('parentContainer', {read: ViewContainerRef}) parentContainer!: ViewContainerRef;
  title = 'frontend';
  private breakpointObserver = inject(BreakpointObserver);
  component = BuildInfoPortionComponent;

  private service = inject(ChartService)
  private apiService = inject(PipelineApiService)

  constructor(private renderer : Renderer2){}

  ngAfterViewInit(): void {
      const parentEl = this.parentContainer.element.nativeElement;
      this.renderer.setStyle(parentEl, 'padding', '10px'); 
      this.renderer.setStyle(parentEl, 'display', 'grid'); 
      this.renderer.setStyle(parentEl, 'grid-template-columns', 'repeat(auto-fill, minmax(550px,1fr))');

    
  }






  /**TODO: if needed Based on the screen size, switch from standard to one column per row */
  leftTiles$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(() => LEFT_GRIDS_DATA)
  );

  /**TODO: if needed, Based on the screen size, switch from standard to one column per row */
  rightTiles$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(() => RIGHT_GRIDS_DATA)
  );

  matLeftInputs : GridParent = {
    rowHeight: '234px',
    tiles: this.leftTiles$
  }
  matRightInputs : GridParent = {
    rowHeight: '139px',
    tiles: this.rightTiles$
  }

}
