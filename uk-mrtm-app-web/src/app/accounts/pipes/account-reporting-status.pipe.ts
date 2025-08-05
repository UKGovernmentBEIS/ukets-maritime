import { Pipe, PipeTransform } from '@angular/core';

import { AccountReportingStatusHistoryCreationDTO } from '@mrtm/api';

const REPORTING_STATUS_MAP = {
  EXEMPT: 'Exempted',
  REQUIRED_TO_REPORT: 'Required to report',
};

@Pipe({
  name: 'accountReportingStatus',
  standalone: true,
})
export class AccountReportingStatusPipe implements PipeTransform {
  transform(value: AccountReportingStatusHistoryCreationDTO['status']): string | null {
    if (!value) {
      return null;
    }
    return REPORTING_STATUS_MAP[value] ?? null;
  }
}
