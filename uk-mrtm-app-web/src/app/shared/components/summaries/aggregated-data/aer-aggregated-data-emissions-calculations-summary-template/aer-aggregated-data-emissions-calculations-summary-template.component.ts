import { ChangeDetectionStrategy, Component, computed, input, InputSignal, Signal } from '@angular/core';

import { GovukTableColumn, TableComponent } from '@netz/govuk-components';

import { provideAggregatedDataEmissionsSummaryColumns } from '@shared/components/summaries/aggregated-data/aer-aggregated-data-emissions-calculations-summary-template/aer-aggregated-data-emissions-calculations-summary-template.consts';
import { BigNumberPipe } from '@shared/pipes';
import { AerAggregatedDataEmissionDto } from '@shared/types';

@Component({
  selector: 'mrtm-aer-aggregated-data-emissions-calculations-summary-template',
  standalone: true,
  imports: [TableComponent, BigNumberPipe],
  templateUrl: './aer-aggregated-data-emissions-calculations-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerAggregatedDataEmissionsCalculationsSummaryTemplateComponent {
  public readonly header: InputSignal<string> = input<string>();
  public readonly data: InputSignal<Array<AerAggregatedDataEmissionDto>> = input<Array<AerAggregatedDataEmissionDto>>();
  public readonly showSummaryComponents: InputSignal<boolean> = input<boolean>(false);
  public readonly showEmissionsColumnHeader: InputSignal<boolean> = input<boolean>(false);
  public readonly includeCo2Captured: InputSignal<boolean> = input<boolean>();
  public readonly boldedColumns: InputSignal<Array<string>> = input<Array<string>>([]);

  public readonly columns: Signal<Array<GovukTableColumn<AerAggregatedDataEmissionDto>>> = computed(() => {
    return provideAggregatedDataEmissionsSummaryColumns(this.showEmissionsColumnHeader(), this.includeCo2Captured());
  });
}
