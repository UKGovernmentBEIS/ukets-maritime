import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  AER_VOYAGES_SUB_TASK,
  AerVoyagesWizardStep,
} from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { aerVoyagesMap } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages-subtask-list.map';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { VoyagesListSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-aer-voyages-summary',
  imports: [
    PageHeadingComponent,
    ButtonDirective,
    ReturnToTaskOrActionPageComponent,
    VoyagesListSummaryTemplateComponent,
    LinkDirective,
    RouterLink,
    ReactiveFormsModule,
    PendingButtonDirective,
  ],
  standalone: true,
  templateUrl: './aer-voyages-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerVoyagesSummaryComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly service: TaskService<AerSubmitTaskPayload> = inject(TaskService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly editable: Signal<boolean> = this.store.select(requestTaskQuery.selectIsEditable);
  readonly wizardStep = AerVoyagesWizardStep;
  readonly wizardMap = aerVoyagesMap;
  readonly voyages = this.store.select(aerCommonQuery.selectVoyagesList);
  readonly subtaskStatus = this.store.select(aerCommonQuery.selectStatusForSubtask(AER_VOYAGES_SUB_TASK));

  readonly warningMessages: Signal<string[]> = computed(() => {
    return this.subtaskStatus() === 'NEEDS_REVIEW'
      ? [
          "The voyage and emission details have been updated due to changes made to the 'Ships and emission details list' subtask. Review the information for each voyage, then select Confirm and continue.",
        ]
      : [];
  });

  readonly canSubmit: Signal<boolean> = computed(() => {
    const statuses = this.voyages().map((voyage) => voyage.status);

    return (
      this.editable() &&
      statuses?.length &&
      statuses?.every((task) => task === TaskItemStatus.COMPLETED) &&
      this.subtaskStatus() !== TaskItemStatus.COMPLETED
    );
  });

  onSubmit(): void {
    this.service
      .submitSubtask(AER_VOYAGES_SUB_TASK, AerVoyagesWizardStep.SUMMARY, this.activatedRoute)
      .pipe(take(1))
      .subscribe();
  }
}
