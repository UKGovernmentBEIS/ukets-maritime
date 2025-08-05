import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AerShipAggregatedData, AerShipEmissions } from '@mrtm/api';

import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import {
  AerAggregatedDataWizardStep,
  mapAggregatedDataToAnnualEmissionsItems,
  mapAggregatedDataToSmallIslandReductionItems,
  mapAggregatedDataToSurrenderEmissionsItems,
  mapAggregatedDataToTotalShipEmissionsItems,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { AerAggregatedDataEmissionsCalculationsSummaryTemplateComponent } from '@shared/components/summaries/aggregated-data/aer-aggregated-data-emissions-calculations-summary-template';
import { AerAggregatedDataFuelConsumptionsSummaryTemplateComponent } from '@shared/components/summaries/aggregated-data/aer-aggregated-data-ship-summary-template/aer-aggregated-data-fuel-consumptions-summary-template';
import { AerAggregatedDataEmissionDto } from '@shared/types';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'mrtm-aer-aggregated-data-ship-summary-template',
  standalone: true,
  imports: [
    RouterLink,
    LinkDirective,
    AerAggregatedDataEmissionsCalculationsSummaryTemplateComponent,
    AerAggregatedDataFuelConsumptionsSummaryTemplateComponent,
    ButtonDirective,
  ],
  templateUrl: './aer-aggregated-data-ship-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerAggregatedDataShipSummaryTemplateComponent {
  readonly editable = input<boolean>(false);
  readonly aggregatedData = input<AerShipAggregatedData>();
  readonly ship = input<AerShipEmissions>();

  readonly wizardStep = AerAggregatedDataWizardStep;

  readonly totalShipEmissionsData: Signal<Array<AerAggregatedDataEmissionDto>> = computed(() =>
    mapAggregatedDataToTotalShipEmissionsItems(this.aggregatedData()),
  );
  readonly surrenderEmissions: Signal<Array<AerAggregatedDataEmissionDto>> = computed(() =>
    mapAggregatedDataToSurrenderEmissionsItems(this.aggregatedData()),
  );
  readonly annualEmissions: Signal<Array<AerAggregatedDataEmissionDto>> = computed(() =>
    mapAggregatedDataToAnnualEmissionsItems(this.aggregatedData()),
  );
  readonly smallIslandReduction: Signal<Array<AerAggregatedDataEmissionDto>> = computed(() =>
    mapAggregatedDataToSmallIslandReductionItems(this.aggregatedData()),
  );

  shouldDisplaySurrenderEmissions: Signal<boolean> = computed(() => {
    const surrenderEmissions = this.surrenderEmissions();

    return surrenderEmissions.map((item) => new BigNumber(item.total).gt(0)).includes(true);
  });
}
