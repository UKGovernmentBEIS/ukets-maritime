import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { RequestFeedbackInvitationComponent } from '@feedback/request-feedback/request-feedback-invitation';

@Component({
  selector: 'mrtm-submit-send-variation-success',
  imports: [PanelComponent, RouterLink, LinkDirective, RequestFeedbackInvitationComponent],
  standalone: true,
  templateUrl: './submit-send-variation-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitSendVariationSuccessComponent {}
