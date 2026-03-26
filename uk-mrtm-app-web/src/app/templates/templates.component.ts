import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';

import {
  DocumentTemplateSearchResults,
  DocumentTemplatesService,
  NotificationTemplateSearchResults,
  NotificationTemplatesService,
} from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { GovukDatePipe } from '@netz/common/pipes';
import { DestroySubject } from '@netz/common/services';
import {
  ButtonDirective,
  GovukTableColumn,
  GovukValidators,
  LinkDirective,
  PaginationComponent,
  TabDirective,
  TableComponent,
  TabsComponent,
  TextInputComponent,
} from '@netz/govuk-components';

@Component({
  selector: 'mrtm-templates',
  imports: [
    AsyncPipe,
    ButtonDirective,
    GovukDatePipe,
    LinkDirective,
    NgTemplateOutlet,
    PageHeadingComponent,
    RouterLink,
    TabsComponent,
    PendingButtonDirective,
    TextInputComponent,
    ReactiveFormsModule,
    TabDirective,
    TableComponent,
    PaginationComponent,
  ],
  standalone: true,
  templateUrl: './templates.component.html',
  providers: [DestroySubject],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplatesComponent {
  private readonly fb = inject(UntypedFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notificationTemplatesService = inject(NotificationTemplatesService);
  private readonly documentTemplatesService = inject(DocumentTemplatesService);

  readonly pageSize = 30;
  currentTabName;
  operatorTabCols: GovukTableColumn[] = [
    { field: 'name', header: 'Template name' },
    { field: 'workflow', header: 'Workflow' },
    { field: 'lastUpdatedDate', header: 'Last changed' },
  ];
  regulatorTabCols: GovukTableColumn[] = this.operatorTabCols.filter((col) => col.field !== 'operatorType');
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
  currentPage$ = new BehaviorSubject<number>(1);
  currentFragment$ = this.route.fragment;
  private term$ = new BehaviorSubject<string>(null);
  templateSearchResults$: Observable<NotificationTemplateSearchResults | DocumentTemplateSearchResults> = combineLatest(
    [
      combineLatest([
        this.currentPage$.pipe(distinctUntilChanged()),
        this.currentFragment$.pipe(
          distinctUntilChanged(),
          tap(() => this.resetSearchForm()),
          tap(() =>
            this.router.navigate(['.'], {
              preserveFragment: true,
              relativeTo: this.route,
            }),
          ),
        ),
      ]).pipe(
        filter(([page]) => page === 1),
        map(([, fragment]) => fragment),
        distinctUntilChanged(),
      ),
      this.currentPage$.pipe(distinctUntilChanged()),
      this.term$.pipe(
        tap(() =>
          this.router.navigate(['.'], {
            preserveFragment: true,
            relativeTo: this.route,
            queryParams: {
              page: 1,
            },
          }),
        ),
      ),
    ],
  ).pipe(
    switchMap(([fragment, currentPage, term]) => {
      switch (fragment) {
        case 'operator-documents':
          this.currentTabName = 'Operator documents';
          return this.documentTemplatesService.getCurrentUserDocumentTemplates(
            currentPage - 1,
            this.pageSize,
            ['OPERATOR'],
            term || null,
          );
        case 'regulator-emails':
          this.currentTabName = 'Regulator emails';
          return this.notificationTemplatesService.getCurrentUserNotificationTemplates(
            currentPage - 1,
            this.pageSize,
            ['REGULATOR'],
            term || null,
          );
        case 'operator-emails':
        default:
          this.currentTabName = 'Operator emails';
          return this.notificationTemplatesService.getCurrentUserNotificationTemplates(
            currentPage - 1,
            this.pageSize,
            ['OPERATOR'],
            term || null,
          );
      }
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
  templates$ = this.templateSearchResults$.pipe(map((results) => results?.templates));
  totalPages$ = this.templateSearchResults$.pipe(map((results) => results?.total));

  onSearch() {
    if (this.searchForm.valid) {
      this.term$.next(this.searchForm.get('term').value);
    }
  }

  navigateToTemplate(templateId: number): void {
    const fragment = this.route.snapshot.fragment;
    this.router.navigate(fragment === 'operator-documents' ? ['document', templateId] : ['email', templateId], {
      relativeTo: this.route,
    });
  }

  private resetSearchForm(): void {
    this.searchForm.reset();
    this.term$.next(null);
  }
}
