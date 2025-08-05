import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { firstValueFrom } from 'rxjs';

import { MaritimeAccountsService, MaritimeAccountUpdateService } from '@mrtm/api';

import { AuthStore } from '@netz/common/auth';
import { PendingRequestService } from '@netz/common/services';
import { mockClass } from '@netz/common/testing';

import { EditOperatorAccountGuard } from '@accounts/guards/edit-operator-account.guard';
import { OperatorAccountsStore } from '@accounts/store';
import { mockedAccount } from '@accounts/testing/mock-data';

let guard: EditOperatorAccountGuard;

describe('EditOperatorAccountGuard -> canActivate', () => {
  let authStore: AuthStore;
  let store: OperatorAccountsStore;
  const accountsService = mockClass(MaritimeAccountsService);
  const pendingRequestService = mockClass(PendingRequestService);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        OperatorAccountsStore,
        EditOperatorAccountGuard,
        { provide: MaritimeAccountUpdateService, useValue: mockClass(MaritimeAccountUpdateService) },
        { provide: MaritimeAccountsService, useValue: accountsService },
        { provide: PendingRequestService, useValue: pendingRequestService },
      ],
    });

    authStore = TestBed.inject(AuthStore);
    store = TestBed.inject(OperatorAccountsStore);
    guard = TestBed.inject(EditOperatorAccountGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow only for regulators and not closed accounts', async () => {
    authStore.setUserState({ roleType: 'REGULATOR' });
    store.setCurrentAccount(mockedAccount);
    const allowReg = await firstValueFrom(guard.canActivate());
    expect(allowReg).toEqual(true);

    authStore.setUserState({ roleType: 'OPERATOR' });
    store.setCurrentAccount({ account: { ...mockedAccount.account, status: 'CLOSED' } });
    const allowOp = await firstValueFrom(guard.canActivate());
    expect(allowOp).toEqual(false);
  });
});
