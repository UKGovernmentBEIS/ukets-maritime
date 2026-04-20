import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';
import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { paymentQuery } from '@requests/tasks/payment/+state';
import { PaymentDetailsSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-mark-as-received-success',
  standalone: true,
  imports: [PanelComponent, LinkDirective, RouterLink, PaymentDetailsSummaryTemplateComponent],
  templateUrl: './mark-as-received-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkAsReceivedSuccessComponent {
  private readonly store = inject(RequestTaskStore);
  public readonly paymentDetails = this.store.select(paymentQuery.selectPayload);
}
