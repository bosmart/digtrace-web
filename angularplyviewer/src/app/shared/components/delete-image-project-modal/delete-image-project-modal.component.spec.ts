import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteImageProjectModalComponent } from './delete-image-project-modal.component';

describe('DeleteImageProjectModalComponent', () => {
  let component: DeleteImageProjectModalComponent;
  let fixture: ComponentFixture<DeleteImageProjectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteImageProjectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteImageProjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
