import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminVerifierUserInvitationDTO } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

@Component({
  selector: 'mrtm-verification-body-admin-user-summary',
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    LinkDirective,
    SummaryListRowActionsDirective,
    RouterLink,
    NgTemplateOutlet,
  ],
  standalone: true,
  templateUrl: './verification-body-admin-user-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationBodyAdminUserSummaryComponent {
  readonly summaryInfo = input<AdminVerifierUserInvitationDTO>();
  readonly formRouterLink = input('edit');
  readonly viewMode = input<'CREATE' | 'VIEW'>('CREATE');
  readonly editable = input(true);
}
