import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, RedirectCommand, Router, RouterStateSnapshot } from '@angular/router';

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
    const resultPromise = firstValueFrom(result$);
    // The guard's value comes from `toObservable` (rxSelect), which only emits once its effect
    // flushes. Drive that flush explicitly so the test doesn't depend on the auto-scheduler, which
    // can be wedged by cross-file state under the non-isolated runner.
    TestBed.tick();
    expect(await resultPromise).toBe(true);
  });

  it('should redirect landing page tree when not logged in', async () => {
    store.setIsLoggedIn(false);
    const result$ = TestBed.runInInjectionContext(() =>
      loggedInGuard({} as any, router.routerState.snapshot),
    ) as Observable<any>;
    const resultPromise = firstValueFrom(result$);
    TestBed.tick();
    expect(await resultPromise).toEqual(router.parseUrl('landing'));
  });

  it('should redirect to landing page keeping the requested url when the route requires it', async () => {
    store.setIsLoggedIn(false);
    const state = {
      root: { data: {}, children: [{ data: { keepUrlOnSignIn: true }, children: [] }] },
    } as unknown as RouterStateSnapshot;
    const result$ = TestBed.runInInjectionContext(() =>
      loggedInGuard({} as ActivatedRouteSnapshot, state),
    ) as Observable<any>;
    const resultPromise = firstValueFrom(result$);
    TestBed.tick();
    expect(await resultPromise).toEqual(new RedirectCommand(router.parseUrl('landing'), { skipLocationChange: true }));
  });
});
