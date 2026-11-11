import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, linkedSignal, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap, tap } from 'rxjs';

import { FeedbackBannerStore } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { BusinessErrorService, catchBadRequest } from '@netz/common/error';
import { UserFullNamePipe } from '@netz/common/pipes';
import {
  ButtonDirective,
  GovukSelectOption,
  PaginationComponent,
  SelectComponent,
  TableComponent,
} from '@netz/govuk-components';

import { initialState, selectFilters, SiteContactsStore } from '@service-access/site-contacts/+store';
import { savePartiallyNotFoundSiteContactError } from '@service-access/site-contacts/errors/business-error';
import {
  SITE_CONTACTS_ADAPTER,
  SiteContactsAssignee,
  SiteContactsContact,
  SiteContactsPage,
} from '@service-access/site-contacts/site-contacts.adapter';
import { SiteContactsFilterComponent } from '@service-access/site-contacts/site-contacts-filter';

type TableData = SiteContactsContact & { user: SiteContactsAssignee };

const EMPTY_CONTACTS_RESPONSE: SiteContactsPage = { contacts: [], editable: false, totalItems: 0 };

@Component({
  selector: 'mrtm-site-contacts-tab',
  imports: [
    ReactiveFormsModule,
    TableComponent,
    SelectComponent,
    NgTemplateOutlet,
    PendingButtonDirective,
    ButtonDirective,
    PaginationComponent,
    UserFullNamePipe,
    SiteContactsFilterComponent,
  ],
  standalone: true,
  templateUrl: './site-contacts-tab.component.html',
  providers: [UserFullNamePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteContactsTabComponent {
  private readonly fb = inject(UntypedFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fullNamePipe = inject(UserFullNamePipe);
  private readonly businessErrorService = inject(BusinessErrorService);
  private readonly feedbackBannerStore: FeedbackBannerStore = inject(FeedbackBannerStore);
  private readonly store = inject(SiteContactsStore);
  protected readonly adapter = inject(SITE_CONTACTS_ADAPTER);

  readonly columns = this.adapter.columns;
  readonly pageSize = this.adapter.pageSize;
  form = this.fb.group({ siteContacts: this.fb.array([]) });

  private readonly refresh = signal(0);
  private readonly filters = this.store.select(selectFilters);
  private readonly businessId = computed(() => this.filters().businessId?.data ?? null);

  protected readonly page = linkedSignal<string | null, number>({
    source: this.businessId,
    computation: (_, previous) => {
      if (previous) {
        return initialState.paging.page;
      }

      const initialPage = this.route.snapshot.queryParams?.['page'];
      return initialPage ? +initialPage : initialState.paging.page;
    },
  });

  private readonly assignees = toSignal(
    toObservable(computed(() => ({ refresh: this.refresh() }))).pipe(switchMap(() => this.adapter.loadAssignees())),
    { initialValue: [] as SiteContactsAssignee[] },
  );

  private readonly contactsResponse = toSignal(
    toObservable(
      computed(() => ({
        page: this.page(),
        refresh: this.refresh(),
        businessId: this.businessId(),
      })),
    ).pipe(switchMap(({ page, businessId }) => this.adapter.loadContacts(page - 1, this.pageSize, businessId))),
    { initialValue: EMPTY_CONTACTS_RESPONSE },
  );

  protected readonly count = computed(() => this.contactsResponse().totalItems);
  protected readonly isEditable = computed(() => this.contactsResponse().editable);

  protected readonly assigneeOptions = computed<GovukSelectOption<string>[]>(() =>
    [{ text: 'Unassigned', value: null }].concat(
      this.assignees()
        .filter((assignee) => assignee.authorityStatus === 'ACTIVE')
        .map((user) => ({ text: this.fullNamePipe.transform(user), value: user.userId })),
    ),
  );

  private readonly allTableData = computed<TableData[]>(() => {
    const users = this.assignees();

    return (this.contactsResponse().contacts ?? [])
      .slice()
      .sort((a, b) => a.accountName.localeCompare(b.accountName))
      .map((contact): TableData => ({
        ...contact,
        user: users.find((user) => user.userId === contact.userId),
        type: this.adapter.accountType ?? contact.type,
      }));
  });

  protected readonly tableData = toSignal(
    toObservable(this.allTableData).pipe(
      tap((contacts) =>
        this.form.setControl(
          'siteContacts',
          this.fb.array(contacts.map(({ accountId, userId }) => this.fb.group({ accountId, userId }))),
        ),
      ),
    ),
    { initialValue: [] as TableData[] },
  );

  /**
   * The pagination component reads the current page from the 'page' query param,
   * so the URL must follow the 'page' signal when a filter change resets it.
   */
  constructor() {
    effect(() => {
      const page = this.page();
      const urlPage = this.route.snapshot.queryParams?.['page'];
      const resolvedPage = urlPage ? +urlPage : initialState.paging.page;

      if (page !== resolvedPage) {
        this.router.navigate([], {
          queryParams: { page },
          queryParamsHandling: 'merge',
          preserveFragment: true,
          relativeTo: this.route,
        });
      }
    });
  }

  onRefresh(): void {
    this.refresh.update((version) => version + 1);
  }

  onSave(): void {
    const siteContactsArray = this.form.get('siteContacts') as UntypedFormArray;
    const updatedAccountNames = siteContactsArray.controls
      .map((control, index) => (control.dirty ? this.tableData()[index]?.accountName : null))
      .filter(Boolean);

    this.adapter
      .saveContacts(siteContactsArray.value)
      .pipe(
        catchBadRequest(this.adapter.saveErrorCodes, () =>
          this.businessErrorService.showError(savePartiallyNotFoundSiteContactError),
        ),
      )
      .subscribe(() => {
        const successMessages = this.adapter.successMessages(updatedAccountNames);

        if (successMessages.length !== 0) {
          this.feedbackBannerStore.setSuccessMessages(successMessages);
          this.form.markAsPristine();
        } else {
          this.feedbackBannerStore.reset();
        }
      });
  }
}
