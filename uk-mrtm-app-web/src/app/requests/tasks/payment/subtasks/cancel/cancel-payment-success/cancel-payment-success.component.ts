import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-cancel-payment-success',
  imports: [PanelComponent, LinkDirective, RouterLink],
  standalone: true,
  templateUrl: './cancel-payment-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelPaymentSuccessComponent {}
