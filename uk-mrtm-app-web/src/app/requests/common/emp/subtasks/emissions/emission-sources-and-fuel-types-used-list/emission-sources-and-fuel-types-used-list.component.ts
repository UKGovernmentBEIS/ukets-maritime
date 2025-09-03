import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { take } from 'rxjs';

import { EmpEmissionsSources } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { ShipStepTitleCustomPipe } from '@requests/common/components/emissions/pipes';
import { ReturnToShipsListTableComponent } from '@requests/common/components/emissions/return-to-ships-list-table';
import { empCommonQuery } from '@requests/common/emp/+state';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { emissionsSourcesValidator } from '@requests/common/emp/subtasks/emissions';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { emissionShipSubtasksMap } from '@requests/common/emp/subtasks/subtask-list.map';
import {
  EmissionSourcesAndFuelTypesUsedSummaryTemplateComponent,
  NotificationBannerComponent,
} from '@shared/components';
import { NotificationBannerStore } from '@shared/components/notification-banner';

@Component({
  selector: 'mrtm-emp-emission-sources-and-fuel-types-used-list',
  standalone: true,
  imports: [
    EmissionSourcesAndFuelTypesUsedSummaryTemplateComponent,
    PageHeadingComponent,
    ShipStepTitleCustomPipe,
    ButtonDirective,
    ReturnToShipsListTableComponent,
    NotificationBannerComponent,
  ],
  templateUrl: './emission-sources-and-fuel-types-used-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmissionSourcesAndFuelTypesUsedListComponent {
  private readonly taskService = inject(TaskService<EmpTaskPayload>);
  private readonly store = inject(RequestTaskStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notificationBannerStore: NotificationBannerStore = inject(NotificationBannerStore);

  readonly shipId = input<string>();
  readonly emissionSources = computed(() =>
    this.store.select(empCommonQuery.selectShipEmissionSources(this.shipId()))(),
  );
  readonly fuelsAndEmissionsFactors = computed(() =>
    this.store.select(empCommonQuery.selectShipFuelsAndEmissionsFactors(this.shipId()))(),
  );
  readonly canContinue = computed(() =>
    emissionsSourcesValidator(this.emissionSources(), this.fuelsAndEmissionsFactors()),
  );
  readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable)();
  readonly taskMap = emissionShipSubtasksMap;
  readonly shipName = computed(() => this.store.select(empCommonQuery.selectShipName(this.shipId()))());
  readonly form = new UntypedFormGroup({});

  onAddItem() {
    this.router.navigate(['../../' + EmissionsWizardStep.EMISSION_SOURCES_FORM, crypto.randomUUID()], {
      relativeTo: this.route,
    });
  }

  onDelete(event: EmpEmissionsSources) {
    this.taskService
      .saveSubtask(EMISSIONS_SUB_TASK, EmissionsWizardStep.EMISSION_SOURCES_LIST, this.route, event.uniqueIdentifier)
      .pipe(take(1))
      .subscribe();
  }

  onContinue() {
    if (this.canContinue()) {
      this.router.navigate([`../../${EmissionsWizardStep.UNCERTAINTY_LEVEL}`], { relativeTo: this.route });
    } else {
      this.form.setErrors({
        emissionSourcesFuelTypesCombination: 'All fuel types should be associated with at least one emission source',
      });
      this.notificationBannerStore.setInvalidForm(this.form);
    }
  }
}
