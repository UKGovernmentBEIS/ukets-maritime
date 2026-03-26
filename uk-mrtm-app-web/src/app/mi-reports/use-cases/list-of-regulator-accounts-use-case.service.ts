import { TitleCasePipe } from '@angular/common';
import { Signal, signal } from '@angular/core';

import { UserAuthorityInfoDTO } from '@mrtm/api';

import { GovukTableColumn } from '@netz/govuk-components';

import { MiReportType } from '@mi-reports/core/mi-report-type.enum';
import { MiReportUseCaseService } from '@mi-reports/use-cases/common';

export class ListOfRegulatorAccountsUseCaseService extends MiReportUseCaseService {
  reportType: MiReportType = MiReportType.LIST_OF_ACCOUNTS_ASSIGNED_REGULATOR_SITE_CONTACTS;
  readonly tableColumns: Signal<Array<GovukTableColumn>> = signal([
    { field: 'Account ID', header: 'Account ID' },
    { field: 'Account name', header: 'Account name' },
    { field: 'Account status', header: 'Account status' },
    { field: 'IMO number', header: 'IMO' },
    { field: 'User status', header: 'User status' },
    { field: 'Assigned regulator', header: 'Assigned regulator' },
  ]);

  public readonly columnValueMapper: Record<string, (value: unknown) => unknown> = {
    'Account status': (value: UserAuthorityInfoDTO['authorityStatus']): string => new TitleCasePipe().transform(value),
    'User status': (value: UserAuthorityInfoDTO['authorityStatus']): string => new TitleCasePipe().transform(value),
  };
}
