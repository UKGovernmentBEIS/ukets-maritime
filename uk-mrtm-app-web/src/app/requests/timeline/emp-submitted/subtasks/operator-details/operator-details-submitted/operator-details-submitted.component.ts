import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpOperatorDetails, LimitedCompanyOrganisation } from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { identifyMaritimeOperatorMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empSubmittedQuery } from '@requests/timeline/emp-submitted/+state';
import { OperatorDetailsSummaryTemplateComponent, ReviewDecisionSummaryTemplateComponent } from '@shared/components';
import { AttachedFile, EmpVariationReviewDecisionDto, SubTaskListMap } from '@shared/types';

interface ViewModel {
  operatorDetails: EmpOperatorDetails;
  operatorDetailsMap: SubTaskListMap<{ operatorDetails: string }>;
  reviewGroupDecision?: EmpVariationReviewDecisionDto | null;
  files: AttachedFile[];
}

@Component({
  selector: 'mrtm-operator-details-submitted',
  imports: [
    PageHeadingComponent,
    OperatorDetailsSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './operator-details-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorDetailsSubmittedComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  private readonly authStore = inject(AuthStore);
  protected readonly isRegulator = computed(() => this.authStore.select(selectUserRoleType)() === 'REGULATOR');

  readonly vm: Signal<ViewModel> = computed(() => {
    const empOperatorDetails = this.store.select(empSubmittedQuery.selectOperatorDetails)();

    return {
      operatorDetails: empOperatorDetails,
      operatorDetailsMap: identifyMaritimeOperatorMap,
      files: this.store.select(
        empSubmittedQuery.selectAttachedFiles(
          (empOperatorDetails?.organisationStructure as LimitedCompanyOrganisation)?.evidenceFiles,
        ),
      )(),
      reviewGroupDecision: this.store.select(empSubmittedQuery.selectReviewGroupDecision('operatorDetails'))(),
    };
  });
}
