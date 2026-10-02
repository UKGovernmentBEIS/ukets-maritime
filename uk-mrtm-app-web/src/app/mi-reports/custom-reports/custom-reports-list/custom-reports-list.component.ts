import { Component, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { debounceTime, distinctUntilChanged, finalize, map, switchMap, tap } from 'rxjs';

import { MiReportsUserDefinedService } from '@mrtm/api';

import {
  CheckboxComponent,
  CheckboxesComponent,
  GovukTableColumn,
  InputSuffixDirective,
  LinkDirective,
  PaginationComponent,
  SelectComponent,
  SortEvent,
  TableComponent,
  TextInputComponent,
} from '@netz/govuk-components';

import { MI_CUSTOM_REPORTS_FORM } from '@mi-reports/custom-reports/custom-reports.constants';
import { CUSTOM_REPORTS_LIST_COLUMNS } from '@mi-reports/custom-reports/custom-reports-list/custom-reports-list.constants';
import { provideCustomReportsListFiltersForm } from '@mi-reports/custom-reports/custom-reports-list/custom-reports-list.provider';

@Component({
  selector: 'mrtm-custom-reports-list',
  imports: [
    TableComponent,
    CheckboxesComponent,
    PaginationComponent,
    ReactiveFormsModule,
    TextInputComponent,
    InputSuffixDirective,
    CheckboxComponent,
    SelectComponent,
    RouterLink,
    LinkDirective,
  ],
  templateUrl: './custom-reports-list.component.html',
  styleUrl: './custom-reports-list.component.scss',
  providers: [provideCustomReportsListFiltersForm],
})
export class CustomReportsListComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(MiReportsUserDefinedService);
  protected readonly formGroup = inject(MI_CUSTOM_REPORTS_FORM);
  protected readonly columns: Array<GovukTableColumn> = CUSTOM_REPORTS_LIST_COLUMNS;
  protected readonly totalPages = signal(0);
  protected readonly pageSize = 10;
  protected readonly searchDebounceTime = 300;
  protected readonly currentPage = signal(1);
  protected readonly isLoading = signal(false);
  protected readonly hasAppliedFilters = signal(false);

  private readonly categoryId = toSignal(this.formGroup.get('categoryId').valueChanges, {
    initialValue: this.formGroup.value?.categoryId,
  });
  private readonly favourites = toSignal(this.formGroup.get('favourites').valueChanges, {
    initialValue: this.formGroup.value?.favourites,
  });

  protected readonly availableCategories = toSignal(
    this.service.getCategories().pipe(
      map((res) =>
        [
          {
            text: 'All',
            value: null,
          },
          ...res.map((item) => ({
            text: item.name,
            value: item.id,
          })),
        ].flat(),
      ),
    ),
  );

  protected readonly data = toSignal(
    this.activatedRoute.queryParams.pipe(
      map((params) => ({
        categoryId: params['categoryId'] ?? undefined,
        term: params['term'] ?? undefined,
        favourites: params['favourites'] ?? undefined,
        page: params['page'] ?? this.currentPage(),
        sort: params['sort'] ?? 'ASC',
      })),
      switchMap(({ page, term, categoryId, favourites, sort }) => {
        // Set here rather than in a preceding tap, so it runs after the cancelled request's finalize
        this.hasAppliedFilters.set(!!(term || categoryId || favourites));
        this.isLoading.set(true);

        return this.service
          .getAllMiReportsUserDefined(page - 1, this.pageSize, {
            favourites,
            term,
            categoryId,
            sortBy: 'REPORT_NAME',
            direction: sort,
          })
          .pipe(finalize(() => this.isLoading.set(false)));
      }),
      tap((res) => this.totalPages.set(res.total)),
      map((res) =>
        (res.queries ?? []).map((query) => ({
          ...query,
          categories: (query.categories ?? []).map((category) => category.name).join(', '),
        })),
      ),
    ),
  );

  protected readonly emptyTableText = computed(() =>
    this.isLoading()
      ? ''
      : this.hasAppliedFilters()
        ? `<h4 class="govuk-heading-s">There are no matching reports.</h4>
      <p class="govuk-body">Improve your results by:</p>
      <ul class="govuk-list govuk-list--bullet">
        <li>removing filters</li>
        <li>checking your spelling</li>        
      </ul>`
        : 'There are no reports available',
  );

  constructor() {
    this.formGroup
      .get('term')
      .valueChanges.pipe(
        map((term: string) => (term ?? '').trim()),
        debounceTime(this.searchDebounceTime),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.onSearch());

    effect(() => {
      const favourites = this.favourites() ?? [];

      this.router.navigate(['.'], {
        relativeTo: this.activatedRoute,
        queryParamsHandling: 'merge',
        preserveFragment: true,
        queryParams: {
          categoryId: this.categoryId() || undefined,
          favourites: favourites?.length && favourites.every((v) => v === true) ? true : undefined,
        },
      });
    });
  }

  protected onSearch() {
    const term = (this.formGroup.value?.term ?? '').trim();

    this.router.navigate(['.'], {
      relativeTo: this.activatedRoute,
      queryParamsHandling: 'merge',
      preserveFragment: true,
      queryParams: {
        term: term?.length ? term : undefined,
        // A new search starts from the first page of its results
        page: undefined,
      },
    });
  }

  protected onSort(event: SortEvent) {
    this.router.navigate(['.'], {
      relativeTo: this.activatedRoute,
      queryParamsHandling: 'merge',
      preserveFragment: true,
      queryParams: {
        sort: event.direction === 'descending' ? 'DESC' : undefined,
      },
    });
  }
}
