import { I18nSelectPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { PAYMENT_ROUTE_PREFIX } from '@requests/common/payment';
import { paymentQuery } from '@requests/tasks/payment/+state';
import { PAYMENT_HINT_MAP } from '@requests/tasks/payment/components/payment-details/payment-details.constants';
import { CANCEL_PAYMENT_ROUTE_PREFIX } from '@requests/tasks/payment/subtasks/cancel';
import { MAKE_PAYMENT_ROUTE_PREFIX } from '@requests/tasks/payment/subtasks/make';
import { MARK_AS_RECEIVED_PAYMENT_ROUTE_PREFIX } from '@requests/tasks/payment/subtasks/mark-as-received';
import { PaymentDetailsSummaryTemplateComponent } from '@shared/components';
import { isNil } from '@shared/utils';

@Component({
  selector: 'mrtm-payment-details',
  imports: [PaymentDetailsSummaryTemplateComponent, ButtonDirective, RouterLink, I18nSelectPipe],
  standalone: true,
  templateUrl: './payment-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentDetailsComponent implements OnInit {
  private readonly store = inject(RequestTaskStore);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  public readonly routePrefix = PAYMENT_ROUTE_PREFIX;
  public readonly makePaymentRoute = MAKE_PAYMENT_ROUTE_PREFIX;
  public readonly markAsReceivedPaymentRoute = MARK_AS_RECEIVED_PAYMENT_ROUTE_PREFIX;
  public readonly cancelPaymentRoute = CANCEL_PAYMENT_ROUTE_PREFIX;
  public readonly hintMap = PAYMENT_HINT_MAP;

  public readonly requestTaskType = this.store.select(requestTaskQuery.selectRequestTaskType);
  public readonly paymentDetails = this.store.select(paymentQuery.selectPayload);
  public readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable);

  public readonly allowedActions = this.store.select(requestTaskQuery.selectAllowedRequestTaskActions);

  ngOnInit(): void {
    if (
      !isNil(this.store.select(paymentQuery.selectExternalPaymentId)()) &&
      this.isEditable() &&
      this.allowedActions().includes('PAYMENT_MARK_AS_PAID')
    ) {
      this.router.navigate(['./', this.routePrefix, this.makePaymentRoute], {
        relativeTo: this.activatedRoute,
      });
    }
  }
}
