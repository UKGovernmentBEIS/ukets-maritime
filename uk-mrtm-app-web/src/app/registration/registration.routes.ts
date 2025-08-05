import { Routes } from '@angular/router';

import { PendingRequestGuard } from '@core/guards/pending-request.guard';
import { ChoosePasswordComponent } from '@registration/choose-password/choose-password.component';
import { ContactDetailsComponent } from '@registration/contact-details/contact-details.component';
import { ClaimOperatorGuard } from '@registration/guards/claim-operator.guard';
import { ConfirmedEmailGuard } from '@registration/guards/confirmed-email.guard';
import { InvalidInvitationLinkComponent } from '@registration/invalid-invitation-link/invalid-invitation-link.component';
import { InvitationComponent } from '@registration/invitation/invitation.component';
import { SuccessComponent } from '@registration/success/success.component';
import { SummaryComponent } from '@registration/summary/summary.component';
import { UserRegistrationComponent } from '@registration/user-registration/user-registration.component';

export const REGISTRATION_ROUTES: Routes = [
  {
    path: 'invitation',
    data: { blockSignInRedirect: true },
    children: [
      {
        path: '',
        title: 'You have been added as a user to this organisation account',
        canActivate: [ClaimOperatorGuard],
        resolve: { operatorInvitationResultData: ClaimOperatorGuard },
        component: InvitationComponent,
        pathMatch: 'full',
      },
      {
        path: 'invalid-link',
        component: InvalidInvitationLinkComponent,
      },
    ],
  },
  {
    path: 'user',
    component: UserRegistrationComponent,
    canActivate: [ConfirmedEmailGuard],
    children: [
      {
        path: 'contact-details',
        title: 'Enter your details',
        component: ContactDetailsComponent,
      },
      {
        path: 'choose-password',
        title: 'Choose a password',
        data: { backlink: '../contact-details' },
        component: ChoosePasswordComponent,
      },
      {
        path: 'summary',
        title: 'Check your answers',
        component: SummaryComponent,
        canDeactivate: [PendingRequestGuard],
      },
      {
        path: 'success',
        title: "You've successfully created a user account",
        component: SuccessComponent,
      },
    ],
  },
];
