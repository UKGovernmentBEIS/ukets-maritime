import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-rfi-rde-cancel-success',
  standalone: true,
  imports: [RouterLink, LinkDirective, PanelComponent],
  templateUrl: './rfi-rde-cancel-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RfiRdeCancelSuccessComponent {}
