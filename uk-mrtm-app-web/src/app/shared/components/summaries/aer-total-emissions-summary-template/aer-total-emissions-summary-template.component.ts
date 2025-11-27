import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { isNil } from 'lodash-es';

import { AerTotalEmissions } from '@mrtm/api';

import { GovukTableColumn, TableComponent } from '@netz/govuk-components';

import { BigNumberPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-aer-total-emissions-summary-template',
  standalone: true,
  imports: [TableComponent, BigNumberPipe],
  templateUrl: './aer-total-emissions-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerTotalEmissionsSummaryTemplateComponent {
  readonly totalEmissions = input.required<AerTotalEmissions>();

  readonly totalEmissionsHeading = 'Total maritime emissions';
  readonly surrenderHeading = 'Emissions figure for surrender';

  readonly columns: GovukTableColumn[] = [
    { field: 'emissionLabel', header: undefined, widthClass: 'app-column-width-20-per' },
    { field: 'co2', header: 'CO2 emissions (t)', widthClass: 'app-column-width-15-per', isNumeric: true },
    { field: 'ch4', header: 'CH4 emissions (tCO2e)', widthClass: 'app-column-width-15-per', isNumeric: true },
    { field: 'n2o', header: 'N2O emissions (tCO2e)', widthClass: 'app-column-width-15-per', isNumeric: true },
    { field: 'total', header: 'Total emissions (tCO2e)', widthClass: 'app-column-width-15-per', isNumeric: true },
  ];

  readonly totalEmissionsTableData = computed(() => {
    const totalEmissions = this.totalEmissions();
    return isNil(totalEmissions)
      ? []
      : [
          {
            emissionLabel: 'Total emissions from all ships',
            co2: totalEmissions.totalEmissions.co2,
            ch4: totalEmissions.totalEmissions.ch4,
            n2o: totalEmissions.totalEmissions.n2o,
            total: totalEmissions.totalEmissions.total,
          },
          {
            emissionLabel: 'Less emissions reduction claim',
            co2: totalEmissions.lessEmissionsReductionClaim.co2,
            ch4: totalEmissions.lessEmissionsReductionClaim.ch4,
            n2o: totalEmissions.lessEmissionsReductionClaim.n2o,
            total: totalEmissions.lessEmissionsReductionClaim.total,
          },
          {
            emissionLabel: this.totalEmissionsHeading,
            total: totalEmissions.totalShipEmissions,
            isSummary: true,
          },
          {
            emissionLabel: 'Less Northern Ireland surrender deduction',
            co2: totalEmissions.lessVoyagesInNorthernIrelandDeduction.co2,
            ch4: totalEmissions.lessVoyagesInNorthernIrelandDeduction.ch4,
            n2o: totalEmissions.lessVoyagesInNorthernIrelandDeduction.n2o,
            total: totalEmissions.lessVoyagesInNorthernIrelandDeduction.total,
            hasPaddingTop: true,
          },
          {
            emissionLabel: this.surrenderHeading,
            total: totalEmissions.surrenderEmissions,
            isSummary: true,
          },
        ];
  });
}
