import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddImageFolderComponent } from './add-image-folder.component';

describe('AddImageFolderComponent', () => {
  let component: AddImageFolderComponent;
  let fixture: ComponentFixture<AddImageFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddImageFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddImageFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
