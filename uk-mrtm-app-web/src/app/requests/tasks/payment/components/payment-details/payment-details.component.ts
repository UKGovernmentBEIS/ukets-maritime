import { I18nSelectPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { paymentQuery } from '@requests/tasks/payment/+state';
import { PAYMENT_HINT_MAP } from '@requests/tasks/payment/components/payment-details/payment-details.constants';
import { PAYMENT_ROUTE_PREFIX } from '@requests/tasks/payment/payment.constants';
import { CANCEL_PAYMENT_ROUTE_PREFIX } from '@requests/tasks/payment/subtasks/cancel';
import { MAKE_PAYMENT_ROUTE_PREFIX } from '@requests/tasks/payment/subtasks/make';
import { MARK_AS_RECEIVED_PAYMENT_ROUTE_PREFIX } from '@requests/tasks/payment/subtasks/mark-as-received';
import { PaymentDetailsSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-payment-details',
  standalone: true,
  imports: [PaymentDetailsSummaryTemplateComponent, ButtonDirective, RouterLink, I18nSelectPipe],
  templateUrl: './payment-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentDetailsComponent {
  private readonly store = inject(RequestTaskStore);
  public readonly routePrefix = PAYMENT_ROUTE_PREFIX;
  public readonly makePaymentRoute = MAKE_PAYMENT_ROUTE_PREFIX;
  public readonly markAsReceivedPaymentRoute = MARK_AS_RECEIVED_PAYMENT_ROUTE_PREFIX;
  public readonly cancelPaymentRoute = CANCEL_PAYMENT_ROUTE_PREFIX;
  public readonly hintMap = PAYMENT_HINT_MAP;

  public readonly requestTaskType = this.store.select(requestTaskQuery.selectRequestTaskType);
  public readonly paymentDetails = this.store.select(paymentQuery.selectPayload);
  public readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable);

  public readonly allowedActions = this.store.select(requestTaskQuery.selectAllowedRequestTaskActions);
}
