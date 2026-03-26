import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerEmissionsWizardStep } from '@requests/common/aer/subtasks/aer-emissions/aer-emissions.helpers';
import { aerEmissionsMap } from '@requests/common/aer/subtasks/aer-subtasks-list.map';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { ListOfShipsSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-aer-emissions-summary',
  imports: [
    PageHeadingComponent,
    ListOfShipsSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    ButtonDirective,
    RouterLink,
    LinkDirective,
  ],
  standalone: true,
  templateUrl: './aer-emissions-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerEmissionsSummaryComponent {
  private readonly store = inject(RequestTaskStore);
  private readonly taskService = inject(TaskService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  readonly map = aerEmissionsMap;

  ships = this.store.select(aerCommonQuery.selectListOfShips);
  isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  isSubTaskCompleted = this.store.select(aerCommonQuery.selectIsSubtaskCompleted(EMISSIONS_SUB_TASK))();
  wizardStep = AerEmissionsWizardStep;
  readonly thirdPartyDataProviderName = this.store.select(aerCommonQuery.selectThirdPartyDataProviderName);

  readonly hasExternalSystemData = computed(() => {
    return !!(this.ships() ?? []).find((ship) => ship?.dataInputType === 'EXTERNAL_PROVIDER');
  });

  constructor() {
    if (this.activatedRoute.snapshot.queryParams?.['change'] === 'true') {
      this.router.navigate([], { queryParams: { change: null }, queryParamsHandling: 'merge', replaceUrl: true });
    }
  }

  onSubmit() {
    this.taskService.submitSubtask(EMISSIONS_SUB_TASK, AerEmissionsWizardStep.SUMMARY, this.activatedRoute).subscribe();
  }
}
