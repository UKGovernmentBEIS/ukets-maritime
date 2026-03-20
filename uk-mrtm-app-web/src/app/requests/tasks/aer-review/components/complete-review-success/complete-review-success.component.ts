import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-submit-success',
  imports: [RouterLink, LinkDirective, PanelComponent],
  standalone: true,
  templateUrl: './complete-review-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteReviewSuccessComponent {}
