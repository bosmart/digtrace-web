import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelsRootComponent } from './models-root.component';

describe('ModelsRootComponent', () => {
  let component: ModelsRootComponent;
  let fixture: ComponentFixture<ModelsRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelsRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelsRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
