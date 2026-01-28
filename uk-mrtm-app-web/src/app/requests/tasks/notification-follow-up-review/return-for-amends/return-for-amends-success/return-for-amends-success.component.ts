import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-return-for-amends-success',
  standalone: true,
  imports: [PanelComponent, LinkDirective, RouterLink],
  template: `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <govuk-panel title="Returned to operator for amends" />
        <h3 class="govuk-heading-m">What happens next</h3>
        <p class="govuk-body">The operator will return their response to you when the amendments have been made.</p>
      </div>
    </div>
    <div>
      <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible" aria-hidden="true" />
      <a govukLink routerLink="/dashboard">Return to: Dashboard</a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnForAmendsSuccessComponent {}
