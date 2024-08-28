import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleJiraComponent } from './sample-jira.component';

describe('SampleJiraComponent', () => {
  let component: SampleJiraComponent;
  let fixture: ComponentFixture<SampleJiraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SampleJiraComponent]
    });
    fixture = TestBed.createComponent(SampleJiraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
