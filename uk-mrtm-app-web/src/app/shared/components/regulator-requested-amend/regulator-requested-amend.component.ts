import { ChangeDetectionStrategy, Component } from '@angular/core';

import { WarningTextComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-regulator-requested-amend',
  standalone: true,
  imports: [WarningTextComponent],
  template: `
    <govuk-warning-text [assistiveText]="null">The regulator has requested amends to your response</govuk-warning-text>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegulatorRequestedAmendComponent {}
