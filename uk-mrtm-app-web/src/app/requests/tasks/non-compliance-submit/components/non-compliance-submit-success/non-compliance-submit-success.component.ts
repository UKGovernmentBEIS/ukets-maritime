import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-non-compliance-submit-success',
  standalone: true,
  imports: [RouterLink, PanelComponent, LinkDirective],
  templateUrl: './non-compliance-submit-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceSuccessComponent {}
