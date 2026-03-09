import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { empVariationReviewedQuery } from '@requests/timeline/emp-variation-reviewed/+state';
import { EmpVariationReviewedSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-emp-variation-reviewed',
  standalone: true,
  imports: [EmpVariationReviewedSummaryTemplateComponent],
  template: '<mrtm-emp-variation-reviewed-summary-template [data]="vm()"/>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVariationReviewedComponent {
  private readonly actionStore: RequestActionStore = inject(RequestActionStore);

  public readonly vm = this.actionStore.select(empVariationReviewedQuery.selectReviewDTO);
}
