import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-emp-variation-regulator-success',
  standalone: true,
  imports: [PanelComponent, RouterLink, LinkDirective],
  templateUrl: './emp-variation-regulator-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVariationRegulatorSuccessComponent {}
