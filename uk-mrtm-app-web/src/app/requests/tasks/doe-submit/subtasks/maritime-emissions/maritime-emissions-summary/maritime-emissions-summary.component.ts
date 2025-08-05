import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { doeCommonQuery, doeTotalMaritimeEmissionsMap, maritimeEmissionsMap } from '@requests/common/doe';
import { DoeTaskPayload } from '@requests/tasks/doe-submit/doe-submit.types';
import {
  MARITIME_EMISSIONS_SUB_TASK,
  MaritimeEmissionsWizardStep,
} from '@requests/tasks/doe-submit/subtasks/maritime-emissions';
import { DoeMaritimeEmissionsSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-maritime-emissions-summary',
  standalone: true,
  imports: [
    ButtonDirective,
    PageHeadingComponent,
    PendingButtonDirective,
    ReturnToTaskOrActionPageComponent,
    DoeMaritimeEmissionsSummaryTemplateComponent,
  ],
  templateUrl: './maritime-emissions-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaritimeEmissionsSummaryComponent {
  private readonly service: TaskService<DoeTaskPayload> = inject(TaskService<DoeTaskPayload>);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  readonly maritimeEmissions = this.store.select(doeCommonQuery.selectMaritimeEmissions)();
  readonly maritimeEmissionsMap = maritimeEmissionsMap;
  readonly doeTotalMaritimeEmissionsMap = doeTotalMaritimeEmissionsMap;
  readonly files = this.store.select(
    doeCommonQuery.selectAttachedFiles(this.maritimeEmissions?.totalMaritimeEmissions?.supportingDocuments),
  )();
  readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable)();
  readonly isSubTaskCompleted = this.store.select(
    doeCommonQuery.selectIsSubtaskCompleted(MARITIME_EMISSIONS_SUB_TASK),
  )();
  readonly wizardStep = MaritimeEmissionsWizardStep;

  onSubmit() {
    this.service
      .submitSubtask(MARITIME_EMISSIONS_SUB_TASK, MaritimeEmissionsWizardStep.SUMMARY, this.route)
      .subscribe();
  }
}
