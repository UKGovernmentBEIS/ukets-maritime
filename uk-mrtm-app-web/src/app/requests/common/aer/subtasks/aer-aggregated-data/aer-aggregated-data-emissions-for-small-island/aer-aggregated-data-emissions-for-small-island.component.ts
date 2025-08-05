import { ChangeDetectionStrategy, Component, computed, inject, input, InputSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { LinkDirective } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerAggregatedEmissionsFormComponent } from '@requests/common/aer/components/aer-aggregated-emissions-form';
import {
  AER_AGGREGATED_DATA_SUB_TASK,
  AerAggregatedDataWizardStep,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { aerAggregatedDataEmissionsForSmallIslandFormProvider } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-emissions-for-small-island/aer-aggregated-data-emissions-for-small-island.form-provider';
import { aerAggregatedDataSubtasksListMap } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-subtasks-list.map';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-aer-aggregated-data-emissions-for-small-island',
  standalone: true,
  imports: [WizardStepComponent, RouterLink, LinkDirective, AerAggregatedEmissionsFormComponent, ReactiveFormsModule],
  providers: [aerAggregatedDataEmissionsForSmallIslandFormProvider],
  templateUrl: './aer-aggregated-data-emissions-for-small-island.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerAggregatedDataEmissionsForSmallIslandComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly service: TaskService<AerSubmitTaskPayload> = inject(TaskService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public readonly formGroup = inject(TASK_FORM);
  public readonly wizardStep = AerAggregatedDataWizardStep;
  public readonly wizardMap = aerAggregatedDataSubtasksListMap;
  public readonly dataId: InputSignal<string> = input<string>();
  public readonly ship = computed(() =>
    this.store.select(aerCommonQuery.selectRelatedShipForAggregatedData(this.dataId()))(),
  );

  public onSubmit(): void {
    this.service
      .saveSubtask(
        AER_AGGREGATED_DATA_SUB_TASK,
        AerAggregatedDataWizardStep.SMALL_ISLAND_EMISSIONS,
        this.activatedRoute,
        this.formGroup.value,
      )
      .pipe(take(1))
      .subscribe();
  }
}
