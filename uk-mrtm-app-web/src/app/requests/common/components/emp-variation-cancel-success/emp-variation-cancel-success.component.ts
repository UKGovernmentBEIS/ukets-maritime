import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-emp-variation-cancel-success',
  imports: [RouterLink, LinkDirective, PanelComponent],
  standalone: true,
  template: `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <govuk-panel title="Task cancelled" />
        <p class="govuk-body">It has been removed from your task dashboard.</p>
      </div>
    </div>
    <a govukLink routerLink="/dashboard">Return to: Dashboard</a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVariationCancelSuccessComponent {}
