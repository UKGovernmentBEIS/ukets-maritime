import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { ServiceFeedbackLinkService } from '@shared/services';

@Component({
  selector: 'mrtm-request-feedback-sent',
  imports: [PanelComponent, LinkDirective, RouterLink],
  standalone: true,
  templateUrl: './request-feedback-sent.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestFeedbackSentComponent {
  constructor() {
    inject(ServiceFeedbackLinkService).hideUntilDestroyed(inject(DestroyRef));
  }
}
