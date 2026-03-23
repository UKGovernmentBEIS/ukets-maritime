import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { take } from 'rxjs';

import { EmpFuelsAndEmissionsFactors } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { ShipStepTitleCustomPipe } from '@requests/common/components/emissions/pipes';
import { ReturnToShipsListTableComponent } from '@requests/common/components/emissions/return-to-ships-list-table';
import { empCommonQuery } from '@requests/common/emp/+state';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { fuelsAndEmissionsFactorsValidator } from '@requests/common/emp/subtasks/emissions/emissions.wizard';
import { emissionShipSubtasksMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { FuelsAndEmissionFactorsSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-emp-fuels-and-emission-factors-list',
  standalone: true,
  imports: [
    ShipStepTitleCustomPipe,
    PageHeadingComponent,
    FuelsAndEmissionFactorsSummaryTemplateComponent,
    ButtonDirective,
    ReturnToShipsListTableComponent,
  ],
  templateUrl: './fuels-and-emission-factors-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuelsAndEmissionFactorsListComponent {
  private readonly taskService = inject(TaskService<EmpTaskPayload>);
  private readonly store = inject(RequestTaskStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly shipId = input<string>();
  readonly fuelsAndFactors = computed(() =>
    this.store.select(empCommonQuery.selectShipFuelsAndEmissionsFactors(this.shipId()))(),
  );
  readonly canContinue = computed(() => fuelsAndEmissionsFactorsValidator(this.fuelsAndFactors()));

  readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable)();
  readonly taskMap = emissionShipSubtasksMap;
  readonly shipName = computed(() => this.store.select(empCommonQuery.selectShipName(this.shipId()))());

  handleAdd() {
    this.router.navigate(['../../' + EmissionsWizardStep.FUELS_AND_EMISSIONS_FORM, crypto.randomUUID()], {
      relativeTo: this.route,
    });
  }

  handleContinue() {
    this.router.navigate([`../../${EmissionsWizardStep.EMISSION_SOURCES_LIST}`], { relativeTo: this.route });
  }

  handleDelete(event: EmpFuelsAndEmissionsFactors) {
    this.taskService
      .saveSubtask(EMISSIONS_SUB_TASK, EmissionsWizardStep.FUELS_AND_EMISSIONS_LIST, this.route, event.uniqueIdentifier)
      .pipe(take(1))
      .subscribe();
  }
}
