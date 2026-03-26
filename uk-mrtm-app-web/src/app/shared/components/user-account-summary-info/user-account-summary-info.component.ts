import { NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
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
  standalone: true,
  templateUrl: './user-account-summary-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAccountSummaryInfoComponent {
  readonly summaryInfo = input<
    ((OperatorUserInvitationDTO & OperatorUserDTO) | VerifierUserInvitationDTO | VerifierUserDTO) & {
      roleCode?: string;
    }
  >();
  readonly formRouterLink = input('edit');
  readonly viewMode = input<'CREATE' | 'VIEW'>('CREATE');
  readonly showPhoneFields = input<boolean>(false);
  readonly phoneType = input<'full' | 'national'>('full');
  readonly editable = input(true);
}
