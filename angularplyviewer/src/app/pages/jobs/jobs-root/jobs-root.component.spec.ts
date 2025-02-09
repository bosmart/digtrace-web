import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsRootComponent } from './jobs-root.component';

describe('JobsRootComponent', () => {
  let component: JobsRootComponent;
  let fixture: ComponentFixture<JobsRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
