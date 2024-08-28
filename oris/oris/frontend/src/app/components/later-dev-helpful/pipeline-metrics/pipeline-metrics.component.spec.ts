import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineMetricsComponent } from './pipeline-metrics.component';

describe('PipelineMetricsComponent', () => {
  let component: PipelineMetricsComponent;
  let fixture: ComponentFixture<PipelineMetricsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PipelineMetricsComponent]
    });
    fixture = TestBed.createComponent(PipelineMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
