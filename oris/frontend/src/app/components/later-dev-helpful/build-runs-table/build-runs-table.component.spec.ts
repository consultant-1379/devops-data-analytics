import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildRunsTableComponent } from './build-runs-table.component';

describe('BuildRunsTableComponent', () => {
  let component: BuildRunsTableComponent;
  let fixture: ComponentFixture<BuildRunsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuildRunsTableComponent]
    });
    fixture = TestBed.createComponent(BuildRunsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
