import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { combineLatest, map, switchMap } from 'rxjs';

import { MiReportsUserDefinedService } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { GovukDatePipe } from '@netz/common/pipes';
import {
  AccordionComponent,
  AccordionItemComponent,
  DetailsComponent,
  PaginationComponent,
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

@Component({
  selector: 'mrtm-custom-reports-history',
  imports: [
    AccordionComponent,
    AccordionItemComponent,
    DetailsComponent,
    GovukDatePipe,
    PageHeadingComponent,
    PaginationComponent,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
  ],
  templateUrl: './custom-reports-history.component.html',
})
export class CustomReportsHistoryComponent {
  private readonly service = inject(MiReportsUserDefinedService);
  private readonly activatedRoute = inject(ActivatedRoute);

  protected readonly currentPage = signal(1);
  public readonly pageSize = 10;
  protected readonly data = toSignal(
    combineLatest([this.activatedRoute.params, this.activatedRoute.queryParams]).pipe(
      map(([params, queryParams]) => ({
        id: Number(params['id']),
        page: queryParams['page'] ?? this.currentPage(),
      })),
      switchMap(({ id, page }) => this.service.getMiReportUserDefinedHistory(Number(id), page - 1, 10)),
    ),
  );
  protected readonly history = history;
}
