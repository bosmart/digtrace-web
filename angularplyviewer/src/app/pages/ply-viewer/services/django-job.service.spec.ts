import { TestBed } from '@angular/core/testing';

import { DjangoJobService } from './django-job.service';

describe('DjangoJobService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DjangoJobService = TestBed.get(DjangoJobService);
    expect(service).toBeTruthy();
  });
});
