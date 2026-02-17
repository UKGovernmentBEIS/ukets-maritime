import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-data-supplier-unappoint-success',
  imports: [PanelComponent, LinkDirective, RouterLink],
  standalone: true,
  templateUrl: './data-supplier-unappoint-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSupplierUnappointSuccessComponent {}
