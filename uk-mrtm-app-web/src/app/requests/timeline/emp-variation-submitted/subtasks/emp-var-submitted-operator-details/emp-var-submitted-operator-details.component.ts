import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpOperatorDetails, LimitedCompanyOrganisation } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { identifyMaritimeOperatorMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empVariationSubmittedQuery } from '@requests/timeline/emp-variation-submitted/+state';
import { OperatorDetailsSummaryTemplateComponent } from '@shared/components';
import { AttachedFile, SubTaskListMap } from '@shared/types';

interface ViewModel {
  operatorDetails: EmpOperatorDetails;
  operatorDetailsMap: SubTaskListMap<{ operatorDetails: string }>;
  files: AttachedFile[];
  declarationFiles: AttachedFile[];
}

@Component({
  selector: 'mrtm-emp-var-submitted-operator-details',
  standalone: true,
  imports: [PageHeadingComponent, OperatorDetailsSummaryTemplateComponent, ReturnToTaskOrActionPageComponent],
  templateUrl: './emp-var-submitted-operator-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarSubmittedOperatorDetailsComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);

  vm: Signal<ViewModel> = computed(() => {
    const empOperatorDetails = this.store.select(empVariationSubmittedQuery.selectOperatorDetails)();

    return {
      operatorDetails: empOperatorDetails,
      operatorDetailsMap: identifyMaritimeOperatorMap,
      files: this.store.select(
        empVariationSubmittedQuery.selectAttachedFiles(
          (empOperatorDetails?.organisationStructure as LimitedCompanyOrganisation)?.evidenceFiles,
        ),
      )(),
      declarationFiles: this.store.select(
        empVariationSubmittedQuery.selectAttachedFiles(empOperatorDetails?.declarationDocuments?.documents),
      )(),
    };
  });
}
