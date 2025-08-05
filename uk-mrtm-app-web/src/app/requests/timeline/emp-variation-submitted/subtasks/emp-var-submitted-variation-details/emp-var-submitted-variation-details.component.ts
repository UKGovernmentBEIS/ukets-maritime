import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { variationDetailsSubtaskMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empVariationSubmittedQuery } from '@requests/timeline/emp-variation-submitted/+state';
import { VariationDetailsSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-emp-var-submitted-variation-details',
  standalone: true,
  imports: [VariationDetailsSummaryTemplateComponent, PageHeadingComponent, ReturnToTaskOrActionPageComponent],
  templateUrl: './emp-var-submitted-variation-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarSubmittedVariationDetailsComponent {
  private readonly store = inject(RequestActionStore);

  variationDetails = this.store.select(empVariationSubmittedQuery.selectEmpVariationDetails)();
  title = variationDetailsSubtaskMap.title;
}
