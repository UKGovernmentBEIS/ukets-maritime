import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { RequestFeedbackInvitationComponent } from '@feedback/request-feedback/request-feedback-invitation';

@Component({
  selector: 'mrtm-send-report-success',
  imports: [RouterLink, PanelComponent, LinkDirective, RequestFeedbackInvitationComponent],
  standalone: true,
  templateUrl: './send-report-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendReportSuccessComponent {}
