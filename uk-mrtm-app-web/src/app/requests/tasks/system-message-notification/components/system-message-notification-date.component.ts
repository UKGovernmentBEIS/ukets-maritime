import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { GovukDatePipe } from '@netz/common/pipes';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

@Component({
  selector: 'mrtm-system-message-notification-date',
  standalone: true,
  imports: [GovukDatePipe],
  template: `
    <div class="govuk-body govuk-!-margin-top-2 govuk-!-margin-bottom-0">
      <strong>Date:</strong>
      {{ startDate() | govukDate: 'datetime' }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemMessageNotificationDateComponent {
  store = inject(RequestTaskStore);
  startDate = computed(() => this.store.select(requestTaskQuery.selectRequestTask)()?.startDate);
}
