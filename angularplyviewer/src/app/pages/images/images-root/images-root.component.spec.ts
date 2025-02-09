import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesRootComponent } from './images-root.component';

describe('ImagesRootComponent', () => {
  let component: ImagesRootComponent;
  let fixture: ComponentFixture<ImagesRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagesRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
