import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';

import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { empBatchReissueQuery } from '@requests/timeline/emp-batch-reissue/+state';
import { EmpBatchReissueSummaryTemplateComponent } from '@shared/components';
import { EmpBatchVariationDetailsDTO } from '@shared/types';

@Component({
  selector: 'mrtm-emp-batch-reissue',
  standalone: true,
  imports: [EmpBatchReissueSummaryTemplateComponent],
  templateUrl: './emp-batch-reissue.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpBatchReissueComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  public readonly actionType: Signal<string> = this.store.select(requestActionQuery.selectActionType);
  public readonly data: Signal<EmpBatchVariationDetailsDTO> = this.store.select(
    empBatchReissueQuery.selectSummaryDetails,
  );
}
