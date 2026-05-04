import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-feedback-sent',
  imports: [PanelComponent],
  standalone: true,
  templateUrl: './feedback-sent.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackSentComponent {}
