import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-non-compliance-close-success',
  standalone: true,
  imports: [RouterLink, PanelComponent, LinkDirective],
  templateUrl: './non-compliance-close-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceCloseSuccessComponent {}
