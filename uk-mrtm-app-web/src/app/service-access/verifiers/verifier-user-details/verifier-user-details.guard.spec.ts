import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { verifierUserDetailsGuard } from '@service-access/verifiers/verifier-user-details/verifier-user-details.guard';

describe('verifierUserDetailsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => verifierUserDetailsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
