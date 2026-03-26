import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';
import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { paymentQuery } from '@requests/tasks/payment/+state';
import { PaymentSuccessSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-payment-success',
  imports: [PanelComponent, LinkDirective, RouterLink, PaymentSuccessSummaryTemplateComponent],
  standalone: true,
  templateUrl: './payment-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentSuccessComponent {
  private readonly store = inject(RequestTaskStore);
  public readonly paymentSummary = this.store.select(paymentQuery.selectPaymentSummary);
}
