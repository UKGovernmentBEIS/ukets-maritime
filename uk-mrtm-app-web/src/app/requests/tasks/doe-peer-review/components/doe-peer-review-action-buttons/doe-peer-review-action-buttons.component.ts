import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ButtonDirective } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-doe-peer-review-action-buttons',
  standalone: true,
  imports: [ButtonDirective, RouterLink],
  template: `
    <div class="govuk-button-group">
      <a govukButton [routerLink]="['doe-peer-review', 'review-decision']">Peer review decision</a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoePeerReviewActionButtonsComponent {}
