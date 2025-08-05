import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

@Component({
  selector: 'mrtm-cancel-payment-success',
  standalone: true,
  imports: [PanelComponent, LinkDirective, RouterLink],
  templateUrl: './cancel-payment-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelPaymentSuccessComponent {}
