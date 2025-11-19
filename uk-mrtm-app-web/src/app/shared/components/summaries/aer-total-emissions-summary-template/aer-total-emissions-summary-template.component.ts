import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { isNil } from 'lodash-es';

import { AerTotalEmissions } from '@mrtm/api';

import { GovukTableColumn, TableComponent } from '@netz/govuk-components';

import { BigNumberPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-aer-total-emissions-summary-template',
  standalone: true,
  imports: [NgTemplateOutlet, TableComponent, BigNumberPipe],
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
            emissionLabel: 'Less captured CO2',
            co2: totalEmissions.lessCapturedCo2.co2,
            ch4: totalEmissions.lessCapturedCo2.ch4,
            n2o: totalEmissions.lessCapturedCo2.n2o,
            total: totalEmissions.lessCapturedCo2.total,
          },
          {
            emissionLabel: 'Less voyages not in scope',
            co2: totalEmissions.lessVoyagesNotInScope.co2,
            ch4: totalEmissions.lessVoyagesNotInScope.ch4,
            n2o: totalEmissions.lessVoyagesNotInScope.n2o,
            total: totalEmissions.lessVoyagesNotInScope.total,
          },
          {
            emissionLabel: 'Less emissions reduction claim',
            co2: totalEmissions.lessAnyERC.co2,
            ch4: totalEmissions.lessAnyERC.ch4,
            n2o: totalEmissions.lessAnyERC.n2o,
            total: totalEmissions.lessAnyERC.total,
          },
          {
            emissionLabel: this.totalEmissionsHeading,
            total: totalEmissions.totalShipEmissions,
            isSummary: true,
          },
        ];
  });

  readonly surrenderTableData = computed(() => {
    const totalEmissions = this.totalEmissions();
    return isNil(totalEmissions)
      ? []
      : [
          {
            emissionLabel: 'Less small island ferry deduction',
            co2: totalEmissions.lessIslandFerryDeduction.co2,
            ch4: totalEmissions.lessIslandFerryDeduction.ch4,
            n2o: totalEmissions.lessIslandFerryDeduction.n2o,
            total: totalEmissions.lessIslandFerryDeduction.total,
          },
          {
            emissionLabel: 'Less 5% ice class deduction',
            co2: totalEmissions.less5PercentIceClassDeduction.co2,
            ch4: totalEmissions.less5PercentIceClassDeduction.ch4,
            n2o: totalEmissions.less5PercentIceClassDeduction.n2o,
            total: totalEmissions.less5PercentIceClassDeduction.total,
          },
          {
            emissionLabel: this.surrenderHeading,
            total: totalEmissions.surrenderEmissions,
            isSummary: true,
          },
        ];
  });
}
