import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { aerAggregatedDataSubtasksListMap } from '@requests/common/aer/subtasks/aer-aggregated-data';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import { AggregatedDataListSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-aer-aggregated-data-list-submitted',
  standalone: true,
  imports: [PageHeadingComponent, ReturnToTaskOrActionPageComponent, AggregatedDataListSummaryTemplateComponent],
  templateUrl: './aer-aggregated-data-list-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerAggregatedDataListSubmittedComponent {
  private readonly store = inject(RequestTaskStore);
  readonly aggregatedData = this.store.select(aerVerificationSubmitQuery.selectAggregatedDataList);
  readonly map = aerAggregatedDataSubtasksListMap;
}
