import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { map } from 'rxjs';

import { MiReportSystemSearchResult } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { GovukTableColumn, LinkDirective, PaginationComponent, TableComponent } from '@netz/govuk-components';

import { createTablePage, miReportTypeDescriptionMap, miReportTypeLinkMap } from '@mi-reports/core/mi-report';

@Component({
  selector: 'mrtm-mi-reports',
  imports: [PageHeadingComponent, TableComponent, LinkDirective, RouterLink, PaginationComponent],
  standalone: true,
  templateUrl: './mi-reports.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiReportsComponent {
  private readonly route = inject(ActivatedRoute);

  readonly data = toSignal(this.route.data.pipe(map((data) => data.miReports as MiReportSystemSearchResult[])));
  readonly currentPage = signal(1);
  readonly currentPageData = computed(() =>
    createTablePage(this.currentPage(), this.pageSize, this.data())
      .map((p) => ({
        ...p,
        description: miReportTypeDescriptionMap[p.miReportType],
      }))
      .sort((a, b) => a.description?.localeCompare(b.description)),
  );

  readonly pageSize = 10;
  readonly miReportTypeLinkMap = miReportTypeLinkMap;
  readonly tableColumns: GovukTableColumn[] = [{ field: 'description', header: 'MI Report Type' }];
}
