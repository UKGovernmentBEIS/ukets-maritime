import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-feedback-sent',
  standalone: true,
  imports: [PanelComponent],
  templateUrl: './feedback-sent.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackSentComponent {}
