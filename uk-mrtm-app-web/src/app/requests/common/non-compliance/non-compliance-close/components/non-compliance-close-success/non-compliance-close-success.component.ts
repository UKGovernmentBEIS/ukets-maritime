import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-non-compliance-close-success',
  imports: [RouterLink, PanelComponent, LinkDirective],
  standalone: true,
  templateUrl: './non-compliance-close-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceCloseSuccessComponent {}
