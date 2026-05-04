import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable,
  ReplaySubject,
  shareReplay,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import {
  AccountContactInfoDTO,
  CaSiteContactsService,
  RegulatorAuthoritiesService,
  RegulatorUserAuthorityInfoDTO,
} from '@mrtm/api';

import { PendingButtonDirective } from '@netz/common/directives';
import { BusinessErrorService, catchBadRequest, ErrorCodes } from '@netz/common/error';
import { UserFullNamePipe } from '@netz/common/pipes';
import { DestroySubject } from '@netz/common/services';
import {
  ButtonDirective,
  GovukSelectOption,
  GovukTableColumn,
  PaginationComponent,
  SelectComponent,
  TableComponent,
} from '@netz/govuk-components';

import { savePartiallyNotFoundSiteContactError } from '@regulators/errors/business-error';
import { NotificationBannerStore } from '@shared/components/notification-banner';
import { FormUtils } from '@shared/utils';

type TableData = AccountContactInfoDTO & { user: RegulatorUserAuthorityInfoDTO; type: string };

@Component({
  selector: 'mrtm-site-contacts',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TableComponent,
    SelectComponent,
    NgTemplateOutlet,
    PendingButtonDirective,
    ButtonDirective,
    PaginationComponent,
    AsyncPipe,
    UserFullNamePipe,
  ],
  standalone: true,
  templateUrl: './site-contacts.component.html',
  providers: [UserFullNamePipe, DestroySubject],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteContactsComponent implements OnInit {
  private readonly fb = inject(UntypedFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly siteContactsService = inject(CaSiteContactsService);
  private readonly fullNamePipe = inject(UserFullNamePipe);
  private readonly regulatorAuthoritiesService = inject(RegulatorAuthoritiesService);
  private readonly businessErrorService = inject(BusinessErrorService);
  private readonly destroy$ = inject(DestroySubject);
  private readonly notificationBannerStore: NotificationBannerStore = inject(NotificationBannerStore);

  page$ = new ReplaySubject<number>(1);
  count$: Observable<number>;
  columns: GovukTableColumn<TableData>[] = [
    { field: 'accountName', header: 'Permit holding account', isHeader: true },
    { field: 'type', header: 'Type' },
    { field: 'user', header: 'Assigned to' },
  ];
  tableData$: Observable<TableData[]>;
  isEditable$: Observable<boolean>;
  readonly pageSize = 50;
  form = this.fb.group({ siteContacts: this.fb.array([]) });
  assigneeOptions$: Observable<GovukSelectOption<string>[]>;
  refresh$ = new Subject<void>();

  ngOnInit(): void {
    const activatedTab$ = this.route.fragment.pipe(filter((fragment) => fragment === 'site-contacts'));

    const regulators$ = merge(activatedTab$, this.refresh$).pipe(
      switchMap(() => this.regulatorAuthoritiesService.getCaRegulators()),
      map((state) => state.caUsers),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    const contacts$ = combineLatest([
      merge(this.refresh$.pipe(switchMap(() => this.page$)), this.page$.pipe(distinctUntilChanged())),
      activatedTab$,
    ]).pipe(
      takeUntil(this.destroy$),
      switchMap(([page]) => this.siteContactsService.getCaSiteContacts(page - 1, this.pageSize)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.count$ = contacts$.pipe(map((state) => state.totalItems));

    this.assigneeOptions$ = regulators$.pipe(
      map((regulators: RegulatorUserAuthorityInfoDTO[]) =>
        regulators.filter((reg) => reg.authorityStatus === 'ACTIVE'),
      ),
      map((users) =>
        [{ text: 'Unassigned', value: null }].concat(
          users.map((user) => ({ text: this.fullNamePipe.transform(user), value: user.userId })),
        ),
      ),
    );
    this.isEditable$ = contacts$.pipe(map((state) => state.editable));
    this.tableData$ = combineLatest([
      contacts$.pipe(
        map((response) => response.contacts.slice().sort((a, b) => a.accountName.localeCompare(b.accountName))),
      ),
      regulators$,
    ]).pipe(
      map(([contacts, users]) =>
        contacts.map(
          (contact): TableData => ({
            ...contact,
            user: users.find((user) => user.userId === contact.userId),
            type: 'Maritime',
          }),
        ),
      ),
      tap((contacts) =>
        this.form.setControl(
          'siteContacts',
          this.fb.array(contacts.map(({ accountId, userId }) => this.fb.group({ accountId, userId }))),
        ),
      ),
    );
  }

  onSave(): void {
    const siteContacts = this.form.get('siteContacts').value;

    this.siteContactsService
      .updateCaSiteContacts(siteContacts)
      .pipe(
        catchBadRequest([ErrorCodes.AUTHORITY1003, ErrorCodes.ACCOUNT1004], () =>
          this.businessErrorService.showError(savePartiallyNotFoundSiteContactError),
        ),
      )
      .subscribe(() => {
        const updatedControlsKeys = FormUtils.findDirtyControlsKeys(this.form);

        if (updatedControlsKeys.length !== 0) {
          this.notificationBannerStore.setSuccessMessages(
            this.createSuccessMessages(updatedControlsKeys.map((x) => (x === 'userId' ? 'user' : x))),
          );
          this.form.markAsPristine();
        } else {
          this.notificationBannerStore.reset();
        }
      });
  }

  private createSuccessMessages(controlKeys: string[]): string[] {
    return controlKeys.map((key) => `${this.columns.find((col) => col.field === key).header} updated`);
  }
}
