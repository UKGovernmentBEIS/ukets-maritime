import { inject } from '@angular/core';

import { Observable } from 'rxjs';

import { PaymentCancelRequestTaskActionPayload, PaymentMarkAsReceivedRequestTaskActionPayload } from '@mrtm/api';

import { TaskApiService, TaskService } from '@netz/common/forms';

import { paymentQuery } from '@requests/tasks/payment/+state';
import { PaymentTaskPayload } from '@requests/tasks/payment/payment.types';
import { PaymentApiService } from '@requests/tasks/payment/services/payment-api.service';

export class PaymentService extends TaskService<PaymentTaskPayload> {
  protected override apiService: PaymentApiService = inject(TaskApiService) as PaymentApiService;

  get payload(): PaymentTaskPayload {
    return this.store.select(paymentQuery.selectPayload)();
  }

  set payload(payload: PaymentTaskPayload) {
    this.store.setPayload(payload);
  }

  public resetState(): boolean {
    this.payload = {
      ...this.payload,
      paymentMethod: undefined,
    };

    return true;
  }

  public cancelPayment(payload: Pick<PaymentCancelRequestTaskActionPayload, 'reason'>): Observable<void> {
    return this.apiService.cancel(payload);
  }

  public markAsReceived(
    payload: Pick<PaymentMarkAsReceivedRequestTaskActionPayload, 'receivedDate'>,
  ): Observable<void> {
    return this.apiService.markAsReceived(payload);
  }

  public loadExistingCardProcessInfo(): Observable<PaymentTaskPayload> {
    return this.apiService.loadExistingCardProcessInfo();
  }
}
