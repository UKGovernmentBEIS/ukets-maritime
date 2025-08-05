import { Routes } from '@angular/router';

import { PendingRequestGuard } from '@core/guards/pending-request.guard';
import { InvalidLinkComponent } from '@invitation/invalid-link/invalid-link.component';
import { InvitationConfirmationComponent } from '@invitation/invitation-confirmation/invitation-confirmation.component';
import { RegulatorInvitationComponent } from '@invitation/regulator-invitation/regulator-invitation.component';
import { RegulatorInvitationGuard } from '@invitation/regulator-invitation/regulator-invitation.guard';
import { VerifierInvitationComponent } from '@invitation/verifier-invitation/verifier-invitation.component';
import { VerifierInvitationGuard } from '@invitation/verifier-invitation/verifier-invitation.guard';

export const INVITATION_ROUTES: Routes = [
  {
    path: 'regulator',
    data: { blockSignInRedirect: true },
    children: [
      {
        path: '',
        title: 'Activate your account',
        component: RegulatorInvitationComponent,
        canActivate: [RegulatorInvitationGuard],
        resolve: { invitedUser: RegulatorInvitationGuard },
        canDeactivate: [PendingRequestGuard],
      },
      {
        path: 'confirmed',
        title: "You've successfully activated your user account",
        component: InvitationConfirmationComponent,
      },
      {
        path: 'invalid-link',
        title: 'This link is invalid',
        component: InvalidLinkComponent,
      },
    ],
  },
  {
    path: 'verifier',
    data: { blockSignInRedirect: true },
    children: [
      {
        path: '',
        title: 'Activate your account',
        component: VerifierInvitationComponent,
        canActivate: [VerifierInvitationGuard],
        resolve: { invitedUser: VerifierInvitationGuard },
        canDeactivate: [PendingRequestGuard],
      },
      {
        path: 'confirmed',
        title: "You've successfully activated your user account",
        component: InvitationConfirmationComponent,
      },
      {
        path: 'invalid-link',
        title: 'This link is invalid',
        component: InvalidLinkComponent,
      },
    ],
  },
];
