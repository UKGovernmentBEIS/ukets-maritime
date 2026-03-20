import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpAcceptedVariationDecisionDetails, EmpOperatorDetails, LimitedCompanyOrganisation } from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { identifyMaritimeOperatorMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empVariationSubmittedQuery } from '@requests/timeline/emp-variation-submitted/+state';
import { OperatorDetailsSummaryTemplateComponent, ReviewDecisionSummaryTemplateComponent } from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';
import { AttachedFile, EmpVariationReviewDecisionDto, SubTaskListMap } from '@shared/types';

interface ViewModel {
  operatorDetails: EmpOperatorDetails;
  operatorDetailsMap: SubTaskListMap<{ operatorDetails: string }>;
  files: AttachedFile[];
  reviewGroupDecision?: EmpVariationReviewDecisionDto | null;
  isVariationRegulator?: boolean;
  regulatorLedReason?: EmpAcceptedVariationDecisionDetails;
  isRegulator?: boolean;
}

@Component({
  selector: 'mrtm-emp-var-submitted-operator-details',
  imports: [
    PageHeadingComponent,
    OperatorDetailsSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    ReviewDecisionSummaryTemplateComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './emp-var-submitted-operator-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarSubmittedOperatorDetailsComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  private readonly authStore: AuthStore = inject(AuthStore);

  readonly vm: Signal<ViewModel> = computed(() => {
    const empOperatorDetails = this.store.select(empVariationSubmittedQuery.selectOperatorDetails)();

    return {
      operatorDetails: empOperatorDetails,
      operatorDetailsMap: identifyMaritimeOperatorMap,
      files: this.store.select(
        empVariationSubmittedQuery.selectAttachedFiles(
          (empOperatorDetails?.organisationStructure as LimitedCompanyOrganisation)?.evidenceFiles,
        ),
      )(),
      reviewGroupDecision: this.store.select(empVariationSubmittedQuery.selectReviewGroupDecision('operatorDetails'))(),
      isVariationRegulator: this.store.select(empVariationSubmittedQuery.selectIsVariationRegulator)(),
      regulatorLedReason: this.store.select(
        empVariationSubmittedQuery.selectVariationRegulatorDecisionDetails('operatorDetails'),
      )(),
      isRegulator: this.authStore.select(selectUserRoleType)() === 'REGULATOR',
    };
  });
}
