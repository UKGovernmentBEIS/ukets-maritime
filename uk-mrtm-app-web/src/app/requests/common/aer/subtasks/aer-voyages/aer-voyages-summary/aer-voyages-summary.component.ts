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
import { AER_VOYAGES_SUB_TASK } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { AerVoyagesWizardStep } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { aerVoyagesMap } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages-subtask-list.map';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { VoyagesListSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-aer-voyages-summary',
  standalone: true,
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
  templateUrl: './aer-voyages-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerVoyagesSummaryComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly service: TaskService<AerSubmitTaskPayload> = inject(TaskService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  public readonly editable: Signal<boolean> = this.store.select(requestTaskQuery.selectIsEditable);
  public readonly wizardStep = AerVoyagesWizardStep;
  public readonly wizardMap = aerVoyagesMap;
  public readonly voyages = this.store.select(aerCommonQuery.selectVoyagesList);

  public readonly subtaskStatus = this.store.select(aerCommonQuery.selectStatusForSubtask(AER_VOYAGES_SUB_TASK));

  public readonly canSubmit: Signal<boolean> = computed(() => {
    const statuses = this.voyages().map((voyage) => voyage.status);

    return (
      this.editable() &&
      statuses?.length &&
      statuses?.every((task) => task === TaskItemStatus.COMPLETED) &&
      this.subtaskStatus() !== TaskItemStatus.COMPLETED
    );
  });

  public onSubmit(): void {
    this.service
      .submitSubtask(AER_VOYAGES_SUB_TASK, AerVoyagesWizardStep.SUMMARY, this.activatedRoute)
      .pipe(take(1))
      .subscribe();
  }
}
