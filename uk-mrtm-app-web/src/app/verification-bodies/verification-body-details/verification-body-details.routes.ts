import { Route } from '@angular/router';

import { PendingRequestGuard } from '@core/guards';
import { DeleteComponent, SuccessComponent } from '@verification-bodies/verification-body-details/delete';
import { EditComponent } from '@verification-bodies/verification-body-details/edit';
import { VerificationBodyDetailsComponent } from '@verification-bodies/verification-body-details/verification-body-details.component';

export const VERIFICATION_BODY_DETAILS_ROUTES: Route[] = [
  {
    path: '',
    component: VerificationBodyDetailsComponent,
  },
  {
    path: 'edit',
    component: EditComponent,
    canDeactivate: [PendingRequestGuard],
    data: { breadcrumb: false, backlink: '../' },
    title: 'Verification body details - Edit verification body details',
  },
  {
    path: 'delete',
    title: 'Verification body details - Delete verification body',
    children: [
      {
        path: '',
        data: { breadcrumb: false, backlink: '../../' },
        component: DeleteComponent,
        canDeactivate: [PendingRequestGuard],
      },
      {
        path: 'success',
        title: 'Verification body details - Delete success',
        component: SuccessComponent,
      },
    ],
  },
];
