import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { createOperatorUserSummaryGuard } from '@accounts/guards/create-operator-user-summary.guard';

describe('createOperatorUserSummaryGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => createOperatorUserSummaryGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
