import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmJobSubmitComponent } from './confirm-job-submit.component';

describe('ConfirmJobSubmitComponent', () => {
  let component: ConfirmJobSubmitComponent;
  let fixture: ComponentFixture<ConfirmJobSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmJobSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmJobSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
