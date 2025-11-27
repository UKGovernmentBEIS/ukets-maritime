import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { firstValueFrom, of } from 'rxjs';

import { AccountReportingStatusHistoryService, MaritimeAccountsService, MaritimeAccountUpdateService } from '@mrtm/api';

import { AuthStore } from '@netz/common/auth';
import { PendingRequestService } from '@netz/common/services';
import { ActivatedRouteSnapshotStub, mockClass } from '@netz/common/testing';

import { AccountReportingStatusHistoryGuard } from '@accounts/guards';
import { OperatorAccountsStore } from '@accounts/store';
import { mockReportingStatusHistoryResults } from '@accounts/testing/accounts-data.mock';

let guard: AccountReportingStatusHistoryGuard;

describe('AccountReportingStatusHistoryGuard -> canActivate', () => {
  let authStore: AuthStore;

  const accountsService = mockClass(MaritimeAccountsService);
  const pendingRequestService = mockClass(PendingRequestService);
  const reportingStatusService = mockClass(AccountReportingStatusHistoryService);

  reportingStatusService.getReportingStatusHistory.mockReturnValue(of(mockReportingStatusHistoryResults as any));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        OperatorAccountsStore,
        AccountReportingStatusHistoryGuard,
        { provide: MaritimeAccountsService, useValue: accountsService },
        { provide: AccountReportingStatusHistoryService, useValue: reportingStatusService },
        { provide: PendingRequestService, useValue: pendingRequestService },
        { provide: MaritimeAccountUpdateService, useValue: mockClass(MaritimeAccountUpdateService) },
      ],
    });

    authStore = TestBed.inject(AuthStore);
    guard = TestBed.inject(AccountReportingStatusHistoryGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow only for regulators', async () => {
    authStore.setUserState({ roleType: 'REGULATOR' });
    const allowReg = await firstValueFrom(guard.canActivate(new ActivatedRouteSnapshotStub({ accountId: 1 })));
    expect(allowReg).toEqual(true);

    authStore.setUserState({ roleType: 'OPERATOR' });
    const allowOp = await firstValueFrom(guard.canActivate(new ActivatedRouteSnapshotStub({ accountId: 1 })));
    expect(allowOp).toEqual(false);
  });
});
