import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageHeadingComponent } from '@netz/common/components';
import { getYearFromRequestId } from '@netz/common/utils';
import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import { workflowsQuery, WorkflowStore } from '@requests/workflows/+state';
import { AerReInitiateStep } from '@requests/workflows/create-action/aer-re-initiate/aer-re-initiate.helpers';
import { taskActionTypeToTitleTransformer } from '@shared/utils/transformers';

@Component({
  selector: 'mrtm-aer-re-initiate-question',
  imports: [PageHeadingComponent, ButtonDirective, RouterLink, LinkDirective],
  standalone: true,
  templateUrl: './aer-re-initiate-question.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerReInitiateQuestionComponent {
  private readonly store = inject(WorkflowStore);

  readonly steps = AerReInitiateStep;
  readonly returnToText = computed(() =>
    taskActionTypeToTitleTransformer(
      this.store.select(workflowsQuery.selectDetails)()?.requestType,
      getYearFromRequestId(this.store.select(workflowsQuery.selectWorkflowId)()),
    ),
  );
}
