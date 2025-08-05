import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpNotificationDetailsOfChange } from '@mrtm/api';

import { RequestActionStore } from '@netz/common/store';

import { notificationSubmittedQuery } from '@requests/timeline/notification-submitted/+state';
import { NotificationDetailsOfChangeSummaryTemplateComponent } from '@shared/components';
import { AttachedFile } from '@shared/types';

interface ViewModel {
  detailsOfChange: EmpNotificationDetailsOfChange;
  notificationFiles: AttachedFile[];
}

@Component({
  selector: 'mrtm-notification-submitted',
  standalone: true,
  imports: [NotificationDetailsOfChangeSummaryTemplateComponent],
  templateUrl: './notification-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationSubmittedComponent {
  private readonly store = inject(RequestActionStore);

  vm: Signal<ViewModel> = computed(() => {
    const detailsOfChange = this.store.select(notificationSubmittedQuery.selectEmpNotificationDetailsOfChange)();
    return {
      detailsOfChange: detailsOfChange,
      notificationFiles: this.store.select(notificationSubmittedQuery.selectAttachedFiles(detailsOfChange.documents))(),
    };
  });
}
