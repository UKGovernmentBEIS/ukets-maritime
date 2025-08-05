import { TitleCasePipe } from '@angular/common';
import { Signal, signal } from '@angular/core';

import { UserAuthorityInfoDTO } from '@mrtm/api';

import { GovukTableColumn } from '@netz/govuk-components';

import { MiReportType } from '@mi-reports/core/mi-report-type.enum';
import { MiReportUseCaseService } from '@mi-reports/use-cases/common';

export class ListOfAccountsUseCaseService extends MiReportUseCaseService {
  reportType: MiReportType = MiReportType.LIST_OF_ACCOUNTS_USERS_CONTACTS;
  tableColumns: Signal<Array<GovukTableColumn>> = signal([
    { field: 'Account ID', header: 'Account ID' },
    { field: 'Account name', header: 'Account Name' },
    { field: 'Account status', header: 'Account Status' },
    { field: 'IMO number', header: 'IMO' },
    { field: 'Permit ID', header: 'EMP ID' },
    { field: 'Name', header: 'Name' },
    { field: 'User role', header: 'User role' },
    { field: 'User status', header: 'User status' },
    { field: 'Telephone', header: 'Telephone' },
    { field: 'Email', header: 'Email' },
    { field: 'Last logon', header: 'Last logon' },
    { field: 'Is User Primary contact?', header: 'Is User Primary contact?' },
    { field: 'Is User Service contact?', header: 'Is User Service contact?' },
    { field: 'Is User Financial contact?', header: 'Is User Financial contact?' },
    { field: 'Is User Secondary contact?', header: 'Is User Secondary contact?' },
  ]);

  public readonly columnValueMapper: Record<string, (value: unknown) => unknown> = {
    'Account status': (value: UserAuthorityInfoDTO['authorityStatus']): string => new TitleCasePipe().transform(value),
    'User status': (value: UserAuthorityInfoDTO['authorityStatus']): string => new TitleCasePipe().transform(value),
  };
}
