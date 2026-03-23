import { Signal, signal } from '@angular/core';

import { MrtmAccountStatus } from '@mrtm/api';

import { GovukTableColumn } from '@netz/govuk-components';

import { MiReportType } from '@mi-reports/core/mi-report-type.enum';
import { getTitleByWorkflowTaskName } from '@mi-reports/mi-report.utils';
import { MiReportUseCaseService } from '@mi-reports/use-cases/common';
import { TaskItemStatus } from '@requests/common';
import { statusTagMap } from '@requests/common/status-tag.map';
import { taskActionTypeToTitleMap } from '@shared/constants';
import { AccountStatusPipe } from '@shared/pipes';

export class RegulatorOutstandingRequestTasksUseCaseService extends MiReportUseCaseService {
  reportType: MiReportType = MiReportType.REGULATOR_OUTSTANDING_REQUEST_TASKS;
  tableColumns: Signal<Array<GovukTableColumn>> = signal([
    { field: 'Account ID', header: 'Account ID' },
    { field: 'Account name', header: 'Account name' },
    { field: 'Account status', header: 'Account status' },
    { field: 'IMO number', header: 'IMO' },
    { field: 'Workflow ID', header: 'Workflow ID' },
    { field: 'Workflow type', header: 'Workflow type' },
    { field: 'Workflow task assignee', header: 'Workflow task assignee' },
    { field: 'Workflow task due date', header: 'Workflow task due date' },
    { field: 'Workflow task days remaining', header: 'Workflow task days remaining' },
    { field: 'Workflow task name', header: 'Workflow task name' },
  ]);

  public readonly columnValueMapper: Record<string, (value: unknown) => unknown> = {
    'Account status': (value: MrtmAccountStatus): string => new AccountStatusPipe().transform(value),
    'Workflow type': (value: string) => taskActionTypeToTitleMap[value],
    'Workflow task name': getTitleByWorkflowTaskName,
    'Workflow status': (value: TaskItemStatus) => statusTagMap[value]?.text,
  };
}
