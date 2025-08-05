import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { takeUntil } from 'rxjs';

import { EmissionsSources } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { TaskService } from '@netz/common/forms';
import { DestroySubject } from '@netz/common/services';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import {
  aerEmissionsSourcesValidator,
  AerEmissionsWizardStep,
} from '@requests/common/aer/subtasks/aer-emissions/aer-emissions.helpers';
import { emissionsShipSubtaskMap, emissionsSubtaskMap } from '@requests/common/components/emissions';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { ReturnToShipsListTableComponent } from '@requests/common/components/emissions/return-to-ships-list-table';
import {
  AerEmissionSourcesAndFuelTypesUsedSummaryTemplateComponent,
  NotificationBannerComponent,
} from '@shared/components';
import { NotificationBannerStore } from '@shared/components/notification-banner';

@Component({
  selector: 'mrtm-aer-emission-sources-and-fuel-types-used-list',
  standalone: true,
  imports: [
    AerEmissionSourcesAndFuelTypesUsedSummaryTemplateComponent,
    PageHeadingComponent,
    ButtonDirective,
    ReturnToShipsListTableComponent,
    NotificationBannerComponent,
  ],
  templateUrl: './aer-emission-sources-and-fuel-types-used-list.component.html',
  providers: [DestroySubject],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerEmissionSourcesAndFuelTypesUsedListComponent {
  private readonly taskService = inject(TaskService);
  private readonly store = inject(RequestTaskStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notificationBannerStore: NotificationBannerStore = inject(NotificationBannerStore);
  private readonly destroy$ = inject(DestroySubject);

  readonly shipId = input<string>();
  readonly emissionSources = computed(() =>
    this.store.select(aerCommonQuery.selectShipEmissionSources(this.shipId()))(),
  );
  readonly fuelsAndEmissionsFactors = computed(() =>
    this.store.select(aerCommonQuery.selectShipFuelsAndEmissionsFactors(this.shipId()))(),
  );
  readonly canContinue = computed(() =>
    aerEmissionsSourcesValidator(this.emissionSources(), this.fuelsAndEmissionsFactors()),
  );
  readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable)();
  readonly taskMap = emissionsShipSubtaskMap;
  readonly shipName = computed(() => this.store.select(aerCommonQuery.selectShipName(this.shipId()))());
  readonly returnToLabel = emissionsSubtaskMap.ships.title;
  readonly form = new UntypedFormGroup({});

  onAddItem(): void {
    this.router.navigate(['../../' + AerEmissionsWizardStep.EMISSION_SOURCES_FORM, crypto.randomUUID()], {
      relativeTo: this.route,
    });
  }

  onDelete(event: EmissionsSources) {
    this.taskService
      .saveSubtask(EMISSIONS_SUB_TASK, AerEmissionsWizardStep.EMISSION_SOURCES_LIST, this.route, event.uniqueIdentifier)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  onContinue(): void {
    if (this.canContinue()) {
      this.router.navigate([`../../${AerEmissionsWizardStep.UNCERTAINTY_LEVEL}`], { relativeTo: this.route });
    } else {
      this.form.setErrors({
        emissionSourcesFuelTypesCombination: 'All fuel types should be associated with at least one emission source',
      });
      this.notificationBannerStore.setInvalidForm(this.form);
    }
  }
}
