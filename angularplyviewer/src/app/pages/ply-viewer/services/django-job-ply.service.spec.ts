import { TestBed } from '@angular/core/testing';

import { DjangoJobPlyService } from './django-job-ply.service';

describe('DjangoJobPlyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DjangoJobPlyService = TestBed.get(DjangoJobPlyService);
    expect(service).toBeTruthy();
  });
});
