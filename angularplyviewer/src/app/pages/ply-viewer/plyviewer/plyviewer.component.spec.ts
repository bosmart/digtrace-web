import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlyviewerComponent } from './plyviewer.component';

describe('PlyviewerComponent', () => {
  let component: PlyviewerComponent;
  let fixture: ComponentFixture<PlyviewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlyviewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlyviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

