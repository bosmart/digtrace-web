import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteJobModalComponent } from './delete-job-modal.component';

describe('DeleteJobModalComponent', () => {
  let component: DeleteJobModalComponent;
  let fixture: ComponentFixture<DeleteJobModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteJobModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteJobModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
