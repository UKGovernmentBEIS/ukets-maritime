import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

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
  readonly data = input<Array<AerAggregatedDataEmissionDto>>();
  readonly showSummaryComponents = input<boolean>(false);
  readonly showEmissionsColumnHeader = input<boolean>(false);
  readonly boldColumns = input<Array<string>>([]);

  readonly columns = computed<Array<GovukTableColumn<AerAggregatedDataEmissionDto>>>(() => {
    return provideAggregatedDataEmissionsSummaryColumns(this.showEmissionsColumnHeader());
  });
}
