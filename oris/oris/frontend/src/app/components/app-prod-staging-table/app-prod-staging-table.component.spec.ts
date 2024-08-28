import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppProdStagingTableComponent } from './app-prod-staging-table.component';

describe('AppProdStagingTableComponent', () => {
  let component: AppProdStagingTableComponent;
  let fixture: ComponentFixture<AppProdStagingTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppProdStagingTableComponent]
    });
    fixture = TestBed.createComponent(AppProdStagingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
