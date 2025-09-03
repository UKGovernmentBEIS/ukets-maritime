import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { mandateSubtaskMap, MandateWizardStep } from '@requests/common/emp/subtasks/mandate';
import { empSubmittedQuery } from '@requests/timeline/emp-submitted/+state';
import {
  MandateRegisteredOwnersListSummaryTemplateComponent,
  MandateResponsibilityDeclarationSummaryTemplateComponent,
  MandateResponsibilitySummaryTemplateComponent,
} from '@shared/components';

@Component({
  selector: 'mrtm-mandate-submitted',
  standalone: true,
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    MandateResponsibilitySummaryTemplateComponent,
    MandateRegisteredOwnersListSummaryTemplateComponent,
    MandateResponsibilityDeclarationSummaryTemplateComponent,
  ],
  templateUrl: './mandate-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MandateSubmittedComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  public readonly subtaskMap = mandateSubtaskMap;
  public readonly mandate = this.store.select(empSubmittedQuery.selectMandate);
  protected readonly wizardStep = MandateWizardStep;
  protected readonly wizardMap = mandateSubtaskMap;
}
