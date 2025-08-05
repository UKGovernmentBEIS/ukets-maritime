import { I18nSelectPipe, KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, Observable, switchMap } from 'rxjs';

import { MrtmAccountViewDTO, RequestsService } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  CheckboxComponent,
  CheckboxesComponent,
  LinkDirective,
  PaginationComponent,
  TagComponent,
} from '@netz/govuk-components';

import { OperatorAccountsStore, selectAccount } from '@accounts/store';
import { RequestStatusTagColorPipe } from '@shared/pipes';
import { MrtmRequestStatus, MrtmRequestType, nonComplianceStatusMap, nonComplianceTypesMap } from '@shared/types';
import { FormUtils, originalOrder } from '@shared/utils';

@Component({
  selector: 'mrtm-non-compliance-tab',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CheckboxesComponent,
    CheckboxComponent,
    LinkDirective,
    RouterLink,
    PaginationComponent,
    KeyValuePipe,
    GovukDatePipe,
    I18nSelectPipe,
    RequestStatusTagColorPipe,
    TagComponent,
  ],
  templateUrl: './non-compliance-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceTabComponent {
  private readonly fb: UntypedFormBuilder = inject(UntypedFormBuilder);
  private readonly requestsService: RequestsService = inject(RequestsService);
  private readonly store: OperatorAccountsStore = inject(OperatorAccountsStore);

  readonly originalOrder = originalOrder;
  readonly typesMap = nonComplianceTypesMap;
  readonly statusMap = nonComplianceStatusMap;
  readonly pageSize = 30;
  readonly page$ = new BehaviorSubject<number>(1);

  readonly searchForm: UntypedFormGroup = this.fb.group({
    requestTypes: [[], { updateOn: 'change' }],
    requestStatuses: [[], { updateOn: 'change' }],
  });

  readonly accountId$ = this.store.pipe(selectAccount).pipe(
    filter((account) => !!account),
    map((account: MrtmAccountViewDTO) => account.id),
  );
  readonly selectedTypes$: Observable<MrtmRequestType[]> = FormUtils.debounceDistinct(
    this.searchForm.get('requestTypes'),
    0,
  );
  readonly selectedStatuses$: Observable<MrtmRequestStatus[]> = FormUtils.debounceDistinct(
    this.searchForm.get('requestStatuses'),
    0,
  );

  readonly workflowResults = toSignal(
    combineLatest([
      this.accountId$,
      this.selectedTypes$,
      this.selectedStatuses$,
      this.page$.pipe(distinctUntilChanged()),
    ]).pipe(
      switchMap(([accountId, types, statuses, page]) =>
        this.requestsService.getRequestDetailsByResource({
          resourceType: 'ACCOUNT',
          resourceId: String(accountId),
          historyCategory: 'NON_COMPLIANCE',
          requestTypes: types,
          requestStatuses: statuses,
          pageNumber: page - 1,
          pageSize: this.pageSize,
        }),
      ),
    ),
  );
}
