import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeImageInfoComponent } from './change-image-info.component';

describe('ChangeImageInfoComponent', () => {
  let component: ChangeImageInfoComponent;
  let fixture: ComponentFixture<ChangeImageInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeImageInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeImageInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
