import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobQueuesBarChartComponent } from './job-queues-bar-chart.component';

describe('JobQueuesBarChartComponent', () => {
  let component: JobQueuesBarChartComponent;
  let fixture: ComponentFixture<JobQueuesBarChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobQueuesBarChartComponent]
    });
    fixture = TestBed.createComponent(JobQueuesBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
