import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { catchError, combineLatest, EMPTY, map, Observable, of, switchMap } from 'rxjs';

import { MaritimeAccountsService, MrtmAccountEmpDTO } from '@mrtm/api';

import { requestActionQuery, RequestActionStore, requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { LinkDirective, TagComponent } from '@netz/govuk-components';

import { OperatorAccountsStatusColorPipe } from '@accounts/pipes';

@Component({
  selector: 'mrtm-incorporate-header',
  templateUrl: './incorporate-header.component.html',
  standalone: true,
  imports: [RouterLink, AsyncPipe, LinkDirective, TagComponent, TitleCasePipe, OperatorAccountsStatusColorPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncorporateHeaderComponent {
  private readonly requestTaskStore = inject(RequestTaskStore);
  private readonly requestActionStore = inject(RequestActionStore);
  private readonly maritimeAccountsService = inject(MaritimeAccountsService);

  accountDetails$: Observable<MrtmAccountEmpDTO> = combineLatest([
    this.requestTaskStore
      .rxSelect(requestTaskQuery.selectRequestInfo)
      .pipe(map((requestInfo) => requestInfo?.accountId)),
    this.requestActionStore.rxSelect(requestActionQuery.selectAction).pipe(map((action) => action?.requestAccountId)),
  ]).pipe(
    map(([requestTaskAccountId, requestActionAccountId]) => requestTaskAccountId ?? requestActionAccountId),
    switchMap((accountId) => {
      return (accountId ? this.maritimeAccountsService.getMaritimeAccount(accountId) : of(null)).pipe(
        catchError(() => EMPTY),
      );
    }),
  );
}
