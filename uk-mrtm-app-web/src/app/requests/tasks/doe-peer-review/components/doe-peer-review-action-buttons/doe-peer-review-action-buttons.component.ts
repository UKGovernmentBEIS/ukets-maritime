import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonDirective } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-doe-peer-review-action-buttons',
  imports: [ButtonDirective, RouterLink],
  standalone: true,
  template: `
    <div class="govuk-button-group">
      <a govukButton [routerLink]="['doe-peer-review', 'review-decision']">Peer review decision</a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoePeerReviewActionButtonsComponent {}
