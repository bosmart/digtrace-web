import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DjangoJobsComponent } from './django-jobs.component';

describe('DjangoJobsComponent', () => {
  let component: DjangoJobsComponent;
  let fixture: ComponentFixture<DjangoJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DjangoJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DjangoJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
