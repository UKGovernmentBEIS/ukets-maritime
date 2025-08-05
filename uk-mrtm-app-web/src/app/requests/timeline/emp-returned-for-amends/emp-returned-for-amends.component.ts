import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { empReturnedForAmendsQuery } from '@requests/timeline/emp-returned-for-amends/+state';
import { EmpReviewReturnForAmendsSubtaskSummaryTemplateComponent } from '@shared/components';
import { empSubtaskToTitle } from '@shared/constants';

@Component({
  selector: 'mrtm-emp-returned-for-amends',
  standalone: true,
  imports: [EmpReviewReturnForAmendsSubtaskSummaryTemplateComponent],
  templateUrl: './emp-returned-for-amends.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpReturnedForAmendsComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  public decisions = this.store.select(empReturnedForAmendsQuery.selectAmendsDecisionsDTO);
  protected readonly subtaskTitleMap = empSubtaskToTitle;
}
