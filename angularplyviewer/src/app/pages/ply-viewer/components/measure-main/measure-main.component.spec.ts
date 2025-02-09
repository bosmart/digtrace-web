import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureMainComponent } from './measure-main.component';

describe('MeasureMainComponent', () => {
  let component: MeasureMainComponent;
  let fixture: ComponentFixture<MeasureMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasureMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasureMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
