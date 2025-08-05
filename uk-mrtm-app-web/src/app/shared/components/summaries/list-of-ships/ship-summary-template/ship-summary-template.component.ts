import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Params } from '@angular/router';

import { EmpEmissionsSources, EmpFuelsAndEmissionsFactors, EmpShipEmissions } from '@mrtm/api';

import { BasicShipDetailsSummaryTemplateComponent } from '@shared/components';
import { CarbonCaptureSummaryTemplateComponent } from '@shared/components/summaries/list-of-ships/carbon-capture-summary-template';
import { EmissionsSourcesAndFuelTypesUsedListSummaryTemplateComponent } from '@shared/components/summaries/list-of-ships/emissions-sources-and-fuel-types-used-list-summary-template';
import { ExemptionConditionsSummaryTemplateComponent } from '@shared/components/summaries/list-of-ships/exemption-conditions-summary-template';
import { FuelsAndEmissionFactorsListSummaryTemplateComponent } from '@shared/components/summaries/list-of-ships/fuels-and-emission-factors-list-summary-template';
import { MeasurementsSummaryTemplateComponent } from '@shared/components/summaries/list-of-ships/measurements-summary-template';
import { UncertaintyLevelSummaryTemplateComponent } from '@shared/components/summaries/list-of-ships/uncertainty-level-summary-template/uncertainty-level-summary-template.component';
import { AttachedFile } from '@shared/types';

@Component({
  selector: 'mrtm-ship-summary-template',
  standalone: true,
  imports: [
    BasicShipDetailsSummaryTemplateComponent,
    FuelsAndEmissionFactorsListSummaryTemplateComponent,
    EmissionsSourcesAndFuelTypesUsedListSummaryTemplateComponent,
    UncertaintyLevelSummaryTemplateComponent,
    MeasurementsSummaryTemplateComponent,
    CarbonCaptureSummaryTemplateComponent,
    ExemptionConditionsSummaryTemplateComponent,
  ],
  templateUrl: './ship-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipSummaryTemplateComponent {
  @Input({ required: true }) data: EmpShipEmissions;
  @Input() isEditable: boolean = false;
  @Input() carbonCaptureFiles: AttachedFile[];
  @Input() changeLinks: Partial<
    Record<
      keyof Omit<EmpShipEmissions, 'uniqueIdentifier'>,
      {
        link: string;
        queryParams: Params;
      }
    >
  >;

  @Output() public readonly deleteFuelsAndEmissionsFactor: EventEmitter<EmpFuelsAndEmissionsFactors> =
    new EventEmitter<EmpFuelsAndEmissionsFactors>();
  @Output() public readonly deleteEmissionsSource: EventEmitter<EmpEmissionsSources> =
    new EventEmitter<EmpEmissionsSources>();

  public onDeleteFuelsAndEmissionsFactor(factor: EmpFuelsAndEmissionsFactors) {
    this.deleteFuelsAndEmissionsFactor.emit(factor);
  }

  public onDeleteEmissionSource(source: EmpEmissionsSources) {
    this.deleteEmissionsSource.emit(source);
  }
}
