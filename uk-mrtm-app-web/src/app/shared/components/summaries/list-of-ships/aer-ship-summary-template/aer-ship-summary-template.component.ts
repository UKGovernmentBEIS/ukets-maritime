import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { AerShipEmissions, EmissionsSources } from '@mrtm/api';

import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import {
  AerDerogationsSummaryTemplateComponent,
  AerEmissionSourcesAndFuelTypesUsedSummaryTemplateComponent,
  AerFuelsAndEmissionFactorsSummaryTemplateComponent,
  BasicShipDetailsSummaryTemplateComponent,
} from '@shared/components';
import { UncertaintyLevelSummaryTemplateComponent } from '@shared/components/summaries/list-of-ships/uncertainty-level-summary-template/uncertainty-level-summary-template.component';
import { FuelsAndEmissionsFactors } from '@shared/types';

@Component({
  selector: 'mrtm-aer-ship-summary-template',
  standalone: true,
  imports: [
    BasicShipDetailsSummaryTemplateComponent,
    AerFuelsAndEmissionFactorsSummaryTemplateComponent,
    AerEmissionSourcesAndFuelTypesUsedSummaryTemplateComponent,
    UncertaintyLevelSummaryTemplateComponent,
    AerDerogationsSummaryTemplateComponent,
    ButtonDirective,
    LinkDirective,
    RouterLink,
  ],
  templateUrl: './aer-ship-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerShipSummaryTemplateComponent {
  public readonly data = input<AerShipEmissions>();
  public readonly isEditable = input<boolean>(false);
  public readonly changeLinks =
    input<
      Partial<
        Record<
          keyof Omit<AerShipEmissions, 'uniqueIdentifier'> & 'emissionSourcesList' & 'fuelsAndEmissionFactorsList',
          { link: string; queryParams: Params }
        >
      >
    >();

  public readonly addItem = output<keyof Pick<AerShipEmissions, 'fuelsAndEmissionsFactors' | 'emissionsSources'>>();
  public readonly removeItem = output<{
    type: keyof Pick<AerShipEmissions, 'fuelsAndEmissionsFactors' | 'emissionsSources'>;
    item: FuelsAndEmissionsFactors | EmissionsSources;
  }>();

  public onAddItem(subtaskStep: keyof Pick<AerShipEmissions, 'fuelsAndEmissionsFactors' | 'emissionsSources'>): void {
    this.addItem.emit(subtaskStep);
  }

  public onDeleteFuelAndEmissionFactor(item: FuelsAndEmissionsFactors): void {
    this.removeItem.emit({
      type: 'fuelsAndEmissionsFactors',
      item,
    });
  }

  public onDeleteEmissionSource(item: EmissionsSources): void {
    this.removeItem.emit({
      type: 'emissionsSources',
      item,
    });
  }
}
