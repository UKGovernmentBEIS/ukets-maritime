import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { paymentActionQuery } from '@requests/timeline/payment/+state';
import { PaymentDetailsSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-payment-status-details',
  standalone: true,
  imports: [PaymentDetailsSummaryTemplateComponent],
  templateUrl: './payment-status-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentStatusDetailsComponent {
  private readonly store = inject(RequestActionStore);
  public readonly data = this.store.select(paymentActionQuery.selectPayload);
}
