import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { take } from 'rxjs';

import { EmpEmissionsSources, EmpFuelsAndEmissionsFactors } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { ReturnToShipsListTableComponent } from '@requests/common/components/emissions/return-to-ships-list-table';
import { empCommonQuery } from '@requests/common/emp/+state';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { EMP_SHIP_SUMMARY_CHANGE_LINKS_MAP } from '@requests/common/emp/subtasks/emissions/ship-summary/ship-summary.consts';
import { ShipSummaryTemplateComponent } from '@shared/components';
import { AttachedFile } from '@shared/types';

@Component({
  selector: 'mrtm-ship-summary',
  standalone: true,
  imports: [
    ShipSummaryTemplateComponent,
    ButtonDirective,
    PendingButtonDirective,
    ReturnToShipsListTableComponent,
    PageHeadingComponent,
  ],
  templateUrl: './ship-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipSummaryComponent {
  private readonly router = inject(Router);
  private readonly store = inject(RequestTaskStore);
  private readonly taskService: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly shipId: string = this.route.snapshot.params['shipId'];

  readonly changeLinks = EMP_SHIP_SUMMARY_CHANGE_LINKS_MAP;

  readonly isEditable = this.store.select(empCommonQuery.selectIsPeerReview)()
    ? false
    : this.store.select(requestTaskQuery.selectIsEditable)();
  readonly data = this.store.select(empCommonQuery.selectShip(this.shipId));
  readonly isShipCompleted = this.store.select(empCommonQuery.selectIsShipStatusCompleted(this.shipId));

  constructor() {
    if (this.route.snapshot.queryParams?.['change'] === 'true') {
      this.router.navigate([], { queryParams: { change: null }, queryParamsHandling: 'merge', replaceUrl: true });
    }
  }

  onSubmit() {
    this.taskService
      .saveSubtask(EMISSIONS_SUB_TASK, EmissionsWizardStep.SHIP_SUMMARY, this.route, this.shipId)
      .subscribe();
  }

  onDeleteEmissionSource(emission: EmpEmissionsSources) {
    this.taskService
      .saveSubtask(EMISSIONS_SUB_TASK, EmissionsWizardStep.EMISSION_SOURCES_LIST, this.route, emission.uniqueIdentifier)
      .pipe(take(1))
      .subscribe();
  }

  onDeleteFuelsAndEmissions(factor: EmpFuelsAndEmissionsFactors) {
    this.taskService
      .saveSubtask(
        EMISSIONS_SUB_TASK,
        EmissionsWizardStep.FUELS_AND_EMISSIONS_LIST,
        this.route,
        factor.uniqueIdentifier,
      )
      .pipe(take(1))
      .subscribe();
  }

  getCarbonCaptureFiles(files: Array<string>): AttachedFile[] {
    return this.store.select(empCommonQuery.selectAttachedFiles(files))();
  }
}
