import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { verificationBodiesGuard } from '@verification-bodies/verification-bodies.guard';

describe('verificationBodiesGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => verificationBodiesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
