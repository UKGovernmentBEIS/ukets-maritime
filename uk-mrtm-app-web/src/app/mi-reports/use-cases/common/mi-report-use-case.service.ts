import { inject, Signal } from '@angular/core';

import { Observable, tap } from 'rxjs';

import { MiReportsService } from '@mrtm/api';

import { GovukTableColumn } from '@netz/govuk-components';

import { ExtendedMiReportResult } from '@mi-reports/core/mi-interfaces';
import { manipulateResultsAndExportToExcel, miReportTypeDescriptionMap } from '@mi-reports/core/mi-report';
import { MiReportType } from '@mi-reports/core/mi-report-type.enum';

export abstract class MiReportUseCaseService<TUserInput = any, TData = unknown> {
  public abstract reportType: MiReportType;
  protected readonly reportsService: MiReportsService = inject(MiReportsService);
  public abstract readonly columnValueMapper: Record<string, (value: unknown) => unknown>;

  public abstract tableColumns: Signal<Array<GovukTableColumn>>;

  public getReportData(userInput?: TUserInput): Observable<ExtendedMiReportResult<TData>> {
    return this.reportsService.generateReport({
      reportType: this.reportType,
      ...(userInput ?? {}),
    });
  }

  public exportToExcel(userInput?: TUserInput): Observable<ExtendedMiReportResult<TData>> {
    return this.getReportData(userInput).pipe(
      tap((result: ExtendedMiReportResult<TData>) => {
        this.exportResultToExcel(result);
      }),
    );
  }

  private exportResultToExcel(miReportResult: ExtendedMiReportResult<TData>): void {
    const reducedResult = miReportResult.results.map((row) =>
      this.tableColumns()
        .map(({ header, field }) => {
          const valueMapper = this.columnValueMapper[field as string];

          return { [header]: valueMapper ? valueMapper(row[field]) : row[field] };
        })
        .reduce((prev, cur) => ({ ...prev, ...cur }), {}),
    );

    manipulateResultsAndExportToExcel(
      {
        reportType: this.reportType,
        columnNames: this.tableColumns().map((col) => col.header),
        results: reducedResult,
      },
      miReportTypeDescriptionMap[this.reportType],
    );
  }
}
