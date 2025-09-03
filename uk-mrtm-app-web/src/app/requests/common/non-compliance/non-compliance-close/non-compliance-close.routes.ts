import { Routes } from '@angular/router';

import { NON_COMPLIANCE_CLOSE_SUCCESS_MESSAGE_PATH } from '@requests/common/non-compliance/non-compliance-close/non-compliance-close.const';
import { NonComplianceCloseService } from '@requests/common/non-compliance/non-compliance-close/non-compliance-close.service';

export const NON_COMPLIANCE_CLOSE_ROUTES: Routes = [
  {
    path: '',
    providers: [NonComplianceCloseService],
    children: [
      {
        path: '',
        title: 'Close non-compliance task',
        data: { breadcrumb: false, backlink: '../' },
        loadComponent: () =>
          import('@requests/common/non-compliance/non-compliance-close/components/non-compliance-close-form').then(
            (c) => c.NonComplianceCloseFormComponent,
          ),
      },
      {
        path: NON_COMPLIANCE_CLOSE_SUCCESS_MESSAGE_PATH,
        title: 'Non-compliance task closed successfully',
        loadComponent: () =>
          import('@requests/common/non-compliance/non-compliance-close/components/non-compliance-close-success').then(
            (c) => c.NonComplianceCloseSuccessComponent,
          ),
      },
    ],
  },
];
