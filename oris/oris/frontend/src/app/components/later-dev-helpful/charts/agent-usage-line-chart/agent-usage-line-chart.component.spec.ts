import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentUsageLineChartComponent } from './agent-usage-line-chart.component';

describe('AgentUsageLineChartComponent', () => {
  let component: AgentUsageLineChartComponent;
  let fixture: ComponentFixture<AgentUsageLineChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentUsageLineChartComponent]
    });
    fixture = TestBed.createComponent(AgentUsageLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
