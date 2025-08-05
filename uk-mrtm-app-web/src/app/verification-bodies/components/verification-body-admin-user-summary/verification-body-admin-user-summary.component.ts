import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
  standalone: true,
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
  templateUrl: './verification-body-admin-user-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationBodyAdminUserSummaryComponent {
  @Input() summaryInfo: AdminVerifierUserInvitationDTO;
  @Input() formRouterLink = 'edit';
  @Input() viewMode: 'CREATE' | 'VIEW' = 'CREATE';
  @Input() editable = true;
}
