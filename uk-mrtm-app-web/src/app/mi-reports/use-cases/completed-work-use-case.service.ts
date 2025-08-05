import { signal, WritableSignal } from '@angular/core';

import { Observable } from 'rxjs';
import { format, subDays } from 'date-fns';

import { MiReportParams, MrtmAccountStatus } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import { GovukTableColumn } from '@netz/govuk-components';

import { CompletedWorkFormModel } from '@mi-reports/components/completed-work-form/completed-work-form.types';
import { ExtendedMiReportResult } from '@mi-reports/core/mi-interfaces';
import { MiReportType } from '@mi-reports/core/mi-report-type.enum';
import { MiReportUseCaseService } from '@mi-reports/use-cases/common';
import { TaskItemStatus } from '@requests/common';
import { itemActionsMap } from '@requests/common/item-actions.map';
import { statusTagMap } from '@requests/common/status-tag.map';
import { taskActionTypeToTitleMap } from '@shared/constants';
import { AccountStatusPipe } from '@shared/pipes';

export class CompletedWorkUseCaseService extends MiReportUseCaseService<CompletedWorkFormModel> {
  public readonly reportType = MiReportType.COMPLETED_WORK;
  public readonly tableColumns: WritableSignal<Array<GovukTableColumn>> = signal<Array<GovukTableColumn>>([
    { field: 'Account ID', header: 'Account ID' },
    { field: 'Account name', header: 'Account name' },
    { field: 'Account status', header: 'Account status' },
    { field: 'IMO number', header: 'IMO' },
    { field: 'EMP ID', header: 'EMP ID' },
    { field: 'Workflow ID', header: 'Workflow ID' },
    { field: 'Workflow type', header: 'Workflow type' },
    { field: 'Workflow status', header: 'Workflow status' },
    { field: 'Timeline event type', header: 'Timeline event type' },
    { field: 'Timeline event Completed by', header: 'Timeline event Completed by' },
    { field: 'Timeline event Date Completed', header: 'Timeline event Date Completed' },
  ]);

  public readonly columnValueMapper: Record<string, (value: unknown) => unknown> = {
    'Account status': (value: MrtmAccountStatus): string => new AccountStatusPipe().transform(value),
    'Workflow type': (value: string) => taskActionTypeToTitleMap[value],
    'Workflow status': (value: TaskItemStatus) => statusTagMap[value]?.text,
    'Timeline event type': (value: string) => itemActionsMap[value]?.text,
    'Timeline event Date Completed': (value: string) => new GovukDatePipe().transform(value, 'datetime'),
  };

  override getReportData(userInput?: CompletedWorkFormModel): Observable<ExtendedMiReportResult> {
    const { year, option, fromDate, toDate } = userInput;

    return this.reportsService.generateReport({
      reportType: this.reportType,
      fromDate:
        option === 'CUSTOM_PERIOD'
          ? format(fromDate, 'yyyy-MM-dd')
          : option === 'LAST_30_DAYS'
            ? format(subDays(new Date(), 30), 'yyyy-MM-dd')
            : format(new Date(year, 0, 1), 'yyyy-MM-dd'),
      toDate:
        option === 'CUSTOM_PERIOD'
          ? format(toDate ?? new Date(), 'yyyy-MM-dd')
          : option === 'ANNUAL'
            ? format(new Date(Number(year) + 1, 0, 1), 'yyyy-MM-dd')
            : undefined,
    } as MiReportParams);
  }
}
