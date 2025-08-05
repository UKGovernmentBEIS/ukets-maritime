import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { MaritimeAccountsService, MaritimeAccountUpdateService } from '@mrtm/api';

import { mockClass } from '@netz/common/testing';

import { CreateOperatorAccountSummaryGuard } from '@accounts/guards/create-operator-account-summary.guard';
import { OperatorAccountsStore } from '@accounts/store';

describe('CreateOperatorAccountSummaryGuard', () => {
  let guard: CreateOperatorAccountSummaryGuard;
  let store: OperatorAccountsStore;

  const router = mockClass(Router);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        OperatorAccountsStore,
        CreateOperatorAccountSummaryGuard,
        { provide: Router, useValue: router },
        { provide: MaritimeAccountsService, useValue: mockClass(MaritimeAccountsService) },
        { provide: MaritimeAccountUpdateService, useValue: mockClass(MaritimeAccountUpdateService) },
      ],
    });

    store = TestBed.inject(OperatorAccountsStore);
    guard = TestBed.inject(CreateOperatorAccountSummaryGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow route when form is initially submitted', async () => {
    store.setIsInitiallySubmitted(true);
    const allow = await firstValueFrom(guard.canActivate());
    expect(allow).toBe(true);
  });

  it('should navigate to create account form page when is not initially submitted', async () => {
    store.setIsInitiallySubmitted(false);
    router.parseUrl.mockReturnValueOnce(new UrlTree());
    const allow = await firstValueFrom(guard.canActivate());
    expect(router.parseUrl).toHaveBeenCalledWith('/accounts/create');
    expect(allow).toBeInstanceOf(UrlTree);
  });
});
