import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { firstValueFrom, Observable } from 'rxjs';

import { AuthStore } from '@netz/common/auth';

import { loggedInGuard } from '@core/guards/logged-in.guard';

describe('loggedInGuard', () => {
  let store: AuthStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    store = TestBed.inject(AuthStore);
    router = TestBed.inject(Router);
  });

  it('should return true when logged in', async () => {
    store.setIsLoggedIn(true);
    const result$ = TestBed.runInInjectionContext(() => loggedInGuard({} as any, {} as any)) as Observable<any>;
    const result = await firstValueFrom(result$);
    expect(result).toBe(true);
  });

  it('should redirect landing page tree when not logged in', async () => {
    store.setIsLoggedIn(false);
    const result = await firstValueFrom(
      TestBed.runInInjectionContext(() => loggedInGuard({} as any, router.routerState.snapshot)) as Observable<any>,
    );
    expect(result).toEqual(router.parseUrl('landing'));
  });
});
