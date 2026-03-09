import { NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { OperatorUserDTO, OperatorUserInvitationDTO } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { UserTypePipe } from '@accounts/pipes';
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
  @Input() summaryInfo: OperatorUserInvitationDTO & OperatorUserDTO;
  @Input() formRouterLink = 'edit';
  @Input() viewMode: 'CREATE' | 'VIEW' = 'CREATE';
  @Input() editable = true;
}
