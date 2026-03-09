import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-data-supplier-unappoint-success',
  standalone: true,
  imports: [PanelComponent, LinkDirective, RouterLink],
  templateUrl: './data-supplier-unappoint-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSupplierUnappointSuccessComponent {}
