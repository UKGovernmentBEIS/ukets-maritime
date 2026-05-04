import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-follow-up-amend-submit-success',
  imports: [LinkDirective, PanelComponent, RouterLink],
  standalone: true,
  template: `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <govuk-panel title="Response sent to regulator" />
      </div>
    </div>
    <h3 class="govuk-heading-m">What happens next</h3>
    <p class="govuk-body">We 've sent your response to the regulator.</p>
    <p class="govuk-body">The regulator will make a decision and respond.</p>
    <div>
      <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible" aria-hidden="true" />
      <a govukLink routerLink="/dashboard">Return to: Dashboard</a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowUpAmendSubmitSuccessComponent {}
