import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';
import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { empVariationReviewQuery } from '@requests/common/emp/+state';
import { empVariationNotifyOperatorStatusMap } from '@requests/tasks/emp-variation-review/components/emp-variation-notify-operator-success/emp-variation-notify-operator-success.consts';

@Component({
  selector: 'mrtm-notify-operator-success',
  imports: [PanelComponent, RouterLink, LinkDirective],
  standalone: true,
  templateUrl: './emp-variation-notify-operator-success.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVariationNotifyOperatorSuccessComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  public readonly variationDeterminationStatus: Signal<string> = computed(
    () => empVariationNotifyOperatorStatusMap[this.store.select(empVariationReviewQuery.selectDetermination)()?.type],
  );
}
