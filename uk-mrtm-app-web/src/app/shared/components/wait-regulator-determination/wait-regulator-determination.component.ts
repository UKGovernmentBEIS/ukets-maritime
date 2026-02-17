import { ChangeDetectionStrategy, Component } from '@angular/core';

import { WarningTextComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-wait-regulator-determination',
  imports: [WarningTextComponent],
  standalone: true,
  template: `
    <govuk-warning-text [assistiveText]="null">Waiting for the regulator to make a determination</govuk-warning-text>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaitRegulatorDeterminationComponent {}
