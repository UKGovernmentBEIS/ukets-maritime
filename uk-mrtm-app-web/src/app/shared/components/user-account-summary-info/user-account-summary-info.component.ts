import { NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { OperatorUserDTO, OperatorUserInvitationDTO, VerifierUserDTO, VerifierUserInvitationDTO } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { UserTypePipe } from '@accounts/pipes/user-type.pipe';
import { PhoneNumberPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-user-account-summary-info',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    TitleCasePipe,
    UserTypePipe,
    RouterLink,
    LinkDirective,
    PhoneNumberPipe,
    NgTemplateOutlet,
  ],
  templateUrl: './user-account-summary-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAccountSummaryInfoComponent {
  @Input() summaryInfo: (
    | (OperatorUserInvitationDTO & OperatorUserDTO)
    | VerifierUserInvitationDTO
    | VerifierUserDTO
  ) & {
    roleCode?: string;
  };
  @Input() formRouterLink = 'edit';
  @Input() viewMode: 'CREATE' | 'VIEW' = 'CREATE';
  @Input() showPhoneFields: boolean = false;
  @Input() phoneType: 'full' | 'national' = 'full';
  @Input() editable = true;
}
