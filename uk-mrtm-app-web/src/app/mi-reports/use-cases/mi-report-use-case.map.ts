import { Provider } from '@angular/core';

import { CompletedWorkFormComponent, completedWorkFormProvider } from '@mi-reports/components';
import { RegulatorOutstandingRequestComponent } from '@mi-reports/components/regulator-outstanding-request';
import { regulatorOutstandingRequestProvider } from '@mi-reports/components/regulator-outstanding-request/regulator-outstanding-request.provider';
import { MI_REPORT_FORM_COMPONENT } from '@mi-reports/core/mi-report.providers';
import { MiReportType } from '@mi-reports/core/mi-report-type.enum';
import { MI_REPORT_USE_CASE_SERVICE } from '@mi-reports/use-cases/common';
import { CompletedWorkUseCaseService } from '@mi-reports/use-cases/completed-work-use-case.service';
import { ListOfAccountsUseCaseService } from '@mi-reports/use-cases/list-of-accounts-use-case.service';
import { ListOfRegulatorAccountsUseCaseService } from '@mi-reports/use-cases/list-of-regulator-accounts-use-case.service';
import { ListOfVerificationBodyUsersUseCaseService } from '@mi-reports/use-cases/list-of-verification-body-users-use-case.service';
import { RegulatorOutstandingRequestTasksUseCaseService } from '@mi-reports/use-cases/regulator-outstanding-request-tasks-use-case.service';

export const miReportUseCaseMap: Partial<Record<keyof typeof MiReportType, Array<Provider>>> = {
  COMPLETED_WORK: [
    completedWorkFormProvider,
    { provide: MI_REPORT_USE_CASE_SERVICE, useClass: CompletedWorkUseCaseService },
    { provide: MI_REPORT_FORM_COMPONENT, useValue: CompletedWorkFormComponent },
  ],
  REGULATOR_OUTSTANDING_REQUEST_TASKS: [
    regulatorOutstandingRequestProvider,
    { provide: MI_REPORT_USE_CASE_SERVICE, useClass: RegulatorOutstandingRequestTasksUseCaseService },
    { provide: MI_REPORT_FORM_COMPONENT, useValue: RegulatorOutstandingRequestComponent },
  ],
  LIST_OF_VERIFICATION_BODY_USERS: [
    { provide: MI_REPORT_USE_CASE_SERVICE, useClass: ListOfVerificationBodyUsersUseCaseService },
  ],
  LIST_OF_ACCOUNTS_ASSIGNED_REGULATOR_SITE_CONTACTS: [
    { provide: MI_REPORT_USE_CASE_SERVICE, useClass: ListOfRegulatorAccountsUseCaseService },
  ],
  LIST_OF_ACCOUNTS_USERS_CONTACTS: [{ provide: MI_REPORT_USE_CASE_SERVICE, useClass: ListOfAccountsUseCaseService }],
};
