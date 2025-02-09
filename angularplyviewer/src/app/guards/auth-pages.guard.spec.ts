import { TestBed, async, inject } from '@angular/core/testing';

import { AuthPagesGuard } from './auth-pages.guard';

describe('AuthPagesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthPagesGuard]
    });
  });

  it('should ...', inject([AuthPagesGuard], (guard: AuthPagesGuard) => {
    expect(guard).toBeTruthy();
  }));
});
