import { ChangeDetectionStrategy, Component, computed, inject, input, InputSignal, Signal } from '@angular/core';
import { UntypedFormGroup, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AerShipAggregatedData } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';
import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import {
  mapAggregatedDataToSurrenderEmissionsItems,
  mapAggregatedDataToTotalShipEmissionsItems,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { AerAggregatedDataShipEmissionsCalculatedTotalsComponent } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-ship-emissions-calculated/aer-aggregated-data-ship-emissions-calculated-totals';
import { aerAggregatedDataSubtasksListMap } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-subtasks-list.map';
import {
  AerAggregatedDataEmissionsCalculationsSummaryTemplateComponent,
  NotificationBannerComponent,
} from '@shared/components';
import { NotificationBannerStore } from '@shared/components/notification-banner';
import { AerAggregatedDataEmissionDto } from '@shared/types';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'mrtm-aer-aggregated-data-ship-emissions-calculated',
  standalone: true,
  imports: [
    PageHeadingComponent,
    AerAggregatedDataShipEmissionsCalculatedTotalsComponent,
    AerAggregatedDataEmissionsCalculationsSummaryTemplateComponent,
    RouterLink,
    ButtonDirective,
    LinkDirective,
    NotificationBannerComponent,
  ],
  templateUrl: './aer-aggregated-data-ship-emissions-calculated.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerAggregatedDataShipEmissionsCalculatedComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly notificationBannerStore: NotificationBannerStore = inject(NotificationBannerStore);
  private readonly form: UntypedFormGroup = new UntypedFormGroup({});

  public readonly wizardMap = aerAggregatedDataSubtasksListMap;
  public readonly dataId: InputSignal<string> = input<string>();
  public readonly data: Signal<AerShipAggregatedData> = computed(() =>
    this.store.select(aerCommonQuery.selectAggregatedDataItem(this.dataId()))(),
  );
  public readonly ship = computed(() =>
    this.store.select(aerCommonQuery.selectRelatedShipForAggregatedData(this.dataId()))(),
  );

  public readonly totalShipEmissionsData: Signal<Array<AerAggregatedDataEmissionDto>> = computed(() =>
    mapAggregatedDataToTotalShipEmissionsItems(this.data()),
  );

  public readonly surrenderEmissions: Signal<Array<AerAggregatedDataEmissionDto>> = computed(() =>
    mapAggregatedDataToSurrenderEmissionsItems(this.data()),
  );

  public onSubmit(): void {
    const currentAggregatedData = this.data();
    let isValid = true;
    const errors: ValidationErrors = {};

    if (new BigNumber(currentAggregatedData.totalShipEmissions).lte(0)) {
      errors['totalShipEmissions'] = 'The total ship emissions should be greater than 0';
      isValid = false;
    }

    if (new BigNumber(currentAggregatedData.surrenderEmissions).lt(0)) {
      errors['surrenderEmissions'] = 'The emissions figure for surrender should be greater than or equal to 0';
      isValid = false;
    }

    if (!isValid) {
      this.form.setErrors(errors);
      this.notificationBannerStore.setInvalidForm(this.form);
      return;
    }

    this.form.reset();
    this.notificationBannerStore.reset();
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }
}
