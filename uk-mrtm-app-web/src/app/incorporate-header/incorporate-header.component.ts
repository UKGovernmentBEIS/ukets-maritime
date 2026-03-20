import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { catchError, combineLatest, EMPTY, map, Observable, of, switchMap } from 'rxjs';

import { MaritimeAccountsService, MrtmAccountEmpDTO } from '@mrtm/api';

import { requestActionQuery, RequestActionStore, requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { LinkDirective, TagComponent } from '@netz/govuk-components';

import { OperatorAccountsStatusColorPipe } from '@accounts/pipes';
import { OperatorAccountsStore, selectCurrentAccount } from '@accounts/store';

@Component({
  selector: 'mrtm-incorporate-header',
  imports: [RouterLink, AsyncPipe, LinkDirective, TagComponent, TitleCasePipe, OperatorAccountsStatusColorPipe],
  standalone: true,
  templateUrl: './incorporate-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncorporateHeaderComponent {
  private readonly requestTaskStore = inject(RequestTaskStore);
  private readonly requestActionStore = inject(RequestActionStore);
  private readonly maritimeAccountsService = inject(MaritimeAccountsService);
  private readonly operatorAccountsStore = inject(OperatorAccountsStore);

  accountDetails$: Observable<MrtmAccountEmpDTO> = combineLatest([
    this.requestTaskStore.rxSelect(requestTaskQuery.selectRequestTaskAccountId),
    this.requestActionStore.rxSelect(requestActionQuery.selectAction).pipe(map((action) => action?.requestAccountId)),
    this.operatorAccountsStore.pipe(selectCurrentAccount),
  ]).pipe(
    map(
      ([requestTaskAccountId, requestActionAccountId, currentAccount]) =>
        requestTaskAccountId ?? requestActionAccountId ?? currentAccount?.account?.id,
    ),
    switchMap((accountId) => {
      return (accountId ? this.maritimeAccountsService.getMaritimeAccount(Number(accountId)) : of(null)).pipe(
        catchError(() => EMPTY),
      );
    }),
  );
}
