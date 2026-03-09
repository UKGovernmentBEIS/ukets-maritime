import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { BehaviorSubject, combineLatest, map, Observable, shareReplay } from 'rxjs';

import { MiReportSearchResult } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { GovukTableColumn, LinkDirective, PaginationComponent, TableComponent } from '@netz/govuk-components';

import { createTablePage, miReportTypeDescriptionMap, miReportTypeLinkMap } from '@mi-reports/core/mi-report';

@Component({
  selector: 'mrtm-mi-reports',
  templateUrl: './mi-reports.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeadingComponent, TableComponent, LinkDirective, RouterLink, AsyncPipe, PaginationComponent],
})
export class MiReportsComponent {
  private readonly route = inject(ActivatedRoute);

  readonly pageSize = 10;
  readonly miReportTypeLinkMap = miReportTypeLinkMap;
  tableColumns: GovukTableColumn[] = [{ field: 'description', header: 'MI Report Type' }];
  currentPage$ = new BehaviorSubject<number>(1);
  private data$: Observable<MiReportSearchResult[]> = this.route.data.pipe(map((data) => data.miReports));
  totalPages$ = this.data$.pipe(map((data) => data?.length));
  currentPageData$ = combineLatest([this.data$, this.currentPage$]).pipe(
    map(([data, currentPage]) =>
      createTablePage(currentPage, this.pageSize, data)
        .map((p) => ({
          ...p,
          description: miReportTypeDescriptionMap[p.miReportType],
        }))
        .sort((a, b) => a.description?.localeCompare(b.description)),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
}
