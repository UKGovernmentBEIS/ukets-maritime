import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest, distinctUntilChanged, map, Observable, switchMap, takeUntil } from 'rxjs';

import { AccountSearchResultInfoDTO, MaritimeAccountsService, UserStateDTO } from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { DestroySubject } from '@netz/common/services';
import {
  ButtonDirective,
  ErrorSummaryComponent,
  GovukValidators,
  PaginationComponent,
  TextInputComponent,
} from '@netz/govuk-components';

import { AccountsListComponent } from '@accounts/containers/accounts-list';
import {
  initialAccountsSearchState,
  OperatorAccountsStore,
  selectAccounts,
  selectPage,
  selectPageSize,
  selectSearchErrorSummaryVisible,
  selectSearchTerm,
  selectTotal,
} from '@accounts/store';
import { Pagination } from '@shared/types';

interface ViewModel extends Pagination {
  userRoleType: UserStateDTO['roleType'];
  searchTerm: string;
  accounts: AccountSearchResultInfoDTO[];
  isSummaryDisplayed: boolean;
}

@Component({
  selector: 'mrtm-accounts',
  imports: [
    PageHeadingComponent,
    AccountsListComponent,
    PendingButtonDirective,
    AsyncPipe,
    ReactiveFormsModule,
    ErrorSummaryComponent,
    TextInputComponent,
    ButtonDirective,
    PaginationComponent,
  ],
  standalone: true,
  templateUrl: './accounts-page.component.html',
  providers: [DestroySubject],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(UntypedFormBuilder);
  private readonly authStore = inject(AuthStore);
  private readonly store = inject(OperatorAccountsStore);
  private readonly maritimeAccountsService = inject(MaritimeAccountsService);
  private readonly destroy$ = inject(DestroySubject);

  vm$: Observable<ViewModel> = combineLatest([
    this.authStore.rxSelect(selectUserRoleType),
    this.store.pipe(selectSearchTerm),
    this.store.pipe(selectAccounts),
    this.store.pipe(selectTotal),
    this.store.pipe(selectPage),
    this.store.pipe(selectPageSize),
    this.store.pipe(selectSearchErrorSummaryVisible),
  ]).pipe(
    map(([role, searchTerm, accounts, total, page, pageSize, searchErrorSummaryVisible]) => ({
      userRoleType: role,
      searchTerm,
      accounts,
      total,
      page,
      pageSize,
      isSummaryDisplayed: searchErrorSummaryVisible,
    })),
  );

  searchForm: UntypedFormGroup = this.fb.group({
    term: [
      null,
      {
        validators: [
          GovukValidators.minLength(3, 'Enter at least 3 characters'),
          GovukValidators.maxLength(256, 'Enter up to 256 characters'),
        ],
      },
    ],
  });

  private get termCtrl(): AbstractControl {
    return this.searchForm?.get('term');
  }

  ngOnInit(): void {
    this.vm$
      .pipe(
        map(({ searchTerm, page, pageSize }) => ({ searchTerm, page, pageSize })),
        distinctUntilChanged((previous, current) => {
          return (
            previous.page === current.page &&
            previous.pageSize === current.pageSize &&
            previous.searchTerm === current.searchTerm
          );
        }),
        switchMap(({ searchTerm, page, pageSize }) => {
          return this.maritimeAccountsService.searchCurrentUserMrtmAccounts(page - 1, pageSize, searchTerm);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(({ accounts, total }) => {
        this.store.setAccounts(accounts);
        this.store.setTotal(total);
      });

    this.route.queryParamMap
      .pipe(
        map((params) => ({
          term: params.get('term')?.trim() || initialAccountsSearchState.searchTerm,
          page: +params.get('page') || initialAccountsSearchState.paging.page,
          pageSize: +params.get('pageSize') || initialAccountsSearchState.paging.pageSize,
        })),
        takeUntil(this.destroy$),
      )
      .subscribe(({ term, page, pageSize }) => {
        this.termCtrl.setValue(term);

        this.store.setPaging({ page, pageSize });
        if (this.searchForm.valid) {
          this.store.setSearchTerm(term);
        }
      });
  }

  onPageChange(page: number) {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
      relativeTo: this.route,
    });
  }

  onSearch() {
    if (this.searchForm.valid) {
      this.store.setSearchErrorSummaryVisible(false);
      this.router.navigate([], {
        queryParams: {
          term: this.termCtrl.value || null,
          page: null,
        },
        queryParamsHandling: 'merge',
        relativeTo: this.route,
      });
    } else {
      this.store.setSearchErrorSummaryVisible(true);
    }
  }
}
