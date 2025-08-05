import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { verificationBodyDetailsGuard } from '@verification-bodies/verification-body-details/verification-body-details.guard';

describe('verificationBodyDetailsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => verificationBodyDetailsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
