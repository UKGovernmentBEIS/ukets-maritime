import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { operatorUserGuard } from '@accounts/guards/operator-user.guard';

describe('operatorUserGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => operatorUserGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
