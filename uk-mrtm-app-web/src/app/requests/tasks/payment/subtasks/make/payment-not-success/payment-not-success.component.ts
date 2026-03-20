import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

@Component({
  selector: 'mrtm-payment-not-success',
  imports: [PageHeadingComponent, ReturnToTaskOrActionPageComponent],
  standalone: true,
  templateUrl: './payment-not-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentNotSuccessComponent {
  private readonly store = inject(RequestTaskStore);
  public taskOwner = this.store.select(requestTaskQuery.selectAssigneeFullName);
}
