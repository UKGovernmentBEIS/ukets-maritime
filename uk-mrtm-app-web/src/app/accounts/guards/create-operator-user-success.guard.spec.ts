import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { createOperatorUserSuccessGuard } from '@accounts/guards/create-operator-user-success.guard';

describe('createOperatorUserSuccessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => createOperatorUserSuccessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
