import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpOperatorDetails, LimitedCompanyOrganisation } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { identifyMaritimeOperatorMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empSubmittedQuery } from '@requests/timeline/emp-submitted/+state';
import { OperatorDetailsSummaryTemplateComponent } from '@shared/components';
import { AttachedFile, SubTaskListMap } from '@shared/types';

interface ViewModel {
  operatorDetails: EmpOperatorDetails;
  operatorDetailsMap: SubTaskListMap<{ operatorDetails: string }>;
  files: AttachedFile[];
}

@Component({
  selector: 'mrtm-operator-details-submitted',
  standalone: true,
  imports: [PageHeadingComponent, OperatorDetailsSummaryTemplateComponent, ReturnToTaskOrActionPageComponent],
  templateUrl: './operator-details-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorDetailsSubmittedComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);

  vm: Signal<ViewModel> = computed(() => {
    const empOperatorDetails = this.store.select(empSubmittedQuery.selectOperatorDetails)();

    return {
      operatorDetails: empOperatorDetails,
      operatorDetailsMap: identifyMaritimeOperatorMap,
      files: this.store.select(
        empSubmittedQuery.selectAttachedFiles(
          (empOperatorDetails?.organisationStructure as LimitedCompanyOrganisation)?.evidenceFiles,
        ),
      )(),
    };
  });
}
