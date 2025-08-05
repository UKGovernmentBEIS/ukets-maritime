import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';
import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { empReviewQuery } from '@requests/common';
import { empReviewNotifyOperatorStatusMap } from '@requests/tasks/emp-review/components/emp-review-notify-operator-success/emp-review-notify-operator-success.consts';

@Component({
  selector: 'mrtm-review-notify-operator-success',
  standalone: true,
  imports: [PanelComponent, RouterLink, LinkDirective],
  templateUrl: './emp-review-notify-operator-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpReviewNotifyOperatorSuccessComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  public readonly determinationStatus: Signal<string> = computed(
    () => empReviewNotifyOperatorStatusMap[this.store.select(empReviewQuery.selectDetermination)()?.type],
  );
}
