import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-emp-variation-regulator-success',
  imports: [PanelComponent, RouterLink, LinkDirective],
  standalone: true,
  templateUrl: './emp-variation-regulator-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVariationRegulatorSuccessComponent {}
