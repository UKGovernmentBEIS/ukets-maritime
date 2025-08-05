import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { isNil } from 'lodash-es';

import { AerAggregatedEmissionsMeasurement } from '@mrtm/api';

import { BigNumberPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-aer-aggregated-data-annual-emissions-totals',
  standalone: true,
  imports: [BigNumberPipe],
  templateUrl: './aer-aggregated-data-annual-emissions-totals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerAggregatedDataAnnualEmissionsTotalsComponent {
  public readonly header = input<string>();
  public readonly data = input<AerAggregatedEmissionsMeasurement>();
  protected readonly isNil = isNil;
}
