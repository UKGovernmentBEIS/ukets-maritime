import { TitleCasePipe } from '@angular/common';
import { Signal, signal } from '@angular/core';

import { UserAuthorityInfoDTO } from '@mrtm/api';

import { GovukTableColumn } from '@netz/govuk-components';

import { MiReportType } from '@mi-reports/core/mi-report-type.enum';
import { MiReportUseCaseService } from '@mi-reports/use-cases/common';

export class ListOfVerificationBodyUsersUseCaseService extends MiReportUseCaseService {
  reportType: MiReportType = MiReportType.LIST_OF_VERIFICATION_BODY_USERS;
  readonly tableColumns: Signal<Array<GovukTableColumn>> = signal([
    { field: 'Verification body name', header: 'Verification body name' },
    { field: 'Account status', header: 'Account status' },
    { field: 'Accreditation reference number', header: 'Accreditation reference number' },
    { field: 'User role', header: 'User role' },
    { field: 'User status', header: 'User status' },
    { field: 'Name', header: 'Name' },
    { field: 'Email', header: 'Email' },
    { field: 'Telephone', header: 'Telephone' },
    { field: 'Last login', header: 'Last logon' },
  ]);

  public readonly columnValueMapper: Record<string, (value: unknown) => unknown> = {
    'Account status': (value: UserAuthorityInfoDTO['authorityStatus']): string => new TitleCasePipe().transform(value),
    'User status': (value: UserAuthorityInfoDTO['authorityStatus']): string => new TitleCasePipe().transform(value),
  };
}
