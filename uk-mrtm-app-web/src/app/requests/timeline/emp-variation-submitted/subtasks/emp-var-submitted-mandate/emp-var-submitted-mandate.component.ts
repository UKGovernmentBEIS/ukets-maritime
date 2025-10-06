import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { mandateMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empVariationSubmittedQuery } from '@requests/timeline/emp-variation-submitted/+state';
import { MandateSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-emp-var-submitted-mandate',
  standalone: true,
  imports: [PageHeadingComponent, ReturnToTaskOrActionPageComponent, MandateSummaryTemplateComponent],
  templateUrl: './emp-var-submitted-mandate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarSubmittedMandateComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);

  readonly mandateMap = mandateMap;
  readonly mandate = this.store.select(empVariationSubmittedQuery.selectMandate)();
  readonly operatorName = this.store.select(empVariationSubmittedQuery.selectOperatorDetails)()?.operatorName;
}
