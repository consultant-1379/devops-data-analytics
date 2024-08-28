import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFailuresDonutChartComponent } from './task-failures-donut-chart.component';

describe('TaskFailuresDonutChartComponent', () => {
  let component: TaskFailuresDonutChartComponent;
  let fixture: ComponentFixture<TaskFailuresDonutChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskFailuresDonutChartComponent]
    });
    fixture = TestBed.createComponent(TaskFailuresDonutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
