import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { empVariationReturnedForAmendsQuery } from '@requests/timeline/emp-variation-returned-for-amends/+state';
import { ReviewReturnForAmendsSubtaskSummaryTemplateComponent } from '@shared/components';
import { empSubtaskToTitle } from '@shared/constants';

@Component({
  selector: 'mrtm-emp-variation-returned-for-amends',
  standalone: true,
  imports: [ReviewReturnForAmendsSubtaskSummaryTemplateComponent],
  templateUrl: './emp-variation-returned-for-amends.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVariationReturnedForAmendsComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  readonly decisions = this.store.select(empVariationReturnedForAmendsQuery.selectAmendsDecisionsDTO);
  readonly subtaskTitleMap = empSubtaskToTitle;
}
