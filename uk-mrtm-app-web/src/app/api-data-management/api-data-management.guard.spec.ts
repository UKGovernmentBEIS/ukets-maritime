import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';

import { AuthStore } from '@netz/common/auth';

import { canActivateApiDataManagement } from '@api-data-management/api-data-management.guard';

describe('canActivateApiDataManagement', () => {
  let authStore: AuthStore;
  let router: Router;

  const callGuard = () => TestBed.runInInjectionContext(() => canActivateApiDataManagement(undefined, undefined));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    authStore = TestBed.inject(AuthStore);
    router = TestBed.inject(Router);
  });

  it('should allow activation when the user role is OPERATOR', () => {
    authStore.setUserState({ roleType: 'OPERATOR' });
    expect(callGuard()).toBe(true);
  });

  it('should redirect to dashboard when the user role is not OPERATOR', () => {
    authStore.setUserState({ roleType: 'REGULATOR' });
    expect(callGuard()).toEqual(router.createUrlTree(['/dashboard']));
  });

  it('should redirect to dashboard when the user has no role', () => {
    authStore.setUserState({ roleType: null });
    const result = callGuard();
    expect(result).toBeInstanceOf(UrlTree);
    expect(result).toEqual(router.createUrlTree(['/dashboard']));
  });
});
