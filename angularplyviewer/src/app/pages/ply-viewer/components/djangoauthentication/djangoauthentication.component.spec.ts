import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DjangoauthenticationComponent } from './djangoauthentication.component';

describe('DjangoauthenticationComponent', () => {
  let component: DjangoauthenticationComponent;
  let fixture: ComponentFixture<DjangoauthenticationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DjangoauthenticationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DjangoauthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
