import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalBuildsListComponent } from './total-builds-list.component';

describe('TotalBuildsListComponent', () => {
  let component: TotalBuildsListComponent;
  let fixture: ComponentFixture<TotalBuildsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalBuildsListComponent]
    });
    fixture = TestBed.createComponent(TotalBuildsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
