import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildDurationLineChartComponent } from './build-duration-line-chart.component';

describe('BuildDurationLineChartComponent', () => {
  let component: BuildDurationLineChartComponent;
  let fixture: ComponentFixture<BuildDurationLineChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuildDurationLineChartComponent]
    });
    fixture = TestBed.createComponent(BuildDurationLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
