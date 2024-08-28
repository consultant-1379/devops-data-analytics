import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildsCountAndStateComponent } from './builds-count-and-state.component';

describe('BuildsCountAndStateComponent', () => {
  let component: BuildsCountAndStateComponent;
  let fixture: ComponentFixture<BuildsCountAndStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuildsCountAndStateComponent]
    });
    fixture = TestBed.createComponent(BuildsCountAndStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
