import { NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
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
  readonly summaryInfo = input<OperatorUserInvitationDTO & OperatorUserDTO>();
  readonly formRouterLink = input('edit');
  readonly viewMode = input<'CREATE' | 'VIEW'>('CREATE');
  readonly editable = input(true);
}
