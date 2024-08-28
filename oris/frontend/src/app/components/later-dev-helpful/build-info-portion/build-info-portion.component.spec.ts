import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildInfoPortionComponent } from './build-info-portion.component';

describe('BuildInfoPortionComponent', () => {
  let component: BuildInfoPortionComponent;
  let fixture: ComponentFixture<BuildInfoPortionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuildInfoPortionComponent]
    });
    fixture = TestBed.createComponent(BuildInfoPortionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
