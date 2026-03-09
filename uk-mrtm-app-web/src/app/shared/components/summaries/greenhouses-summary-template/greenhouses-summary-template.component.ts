import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params } from '@angular/router';

import { EmpMonitoringGreenhouseGas } from '@mrtm/api';

import { ProcedureFormPartialSummaryTemplateComponent } from '@shared/components/summaries/procedure-form-partial-summary-template';
import { SubTaskListMap } from '@shared/types';

@Component({
  selector: 'mrtm-greenhouses-summary-template',
  standalone: true,
  imports: [ProcedureFormPartialSummaryTemplateComponent],
  templateUrl: './greenhouses-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreenhousesSummaryTemplateComponent {
  @Input({ required: true }) greenhouseGas: EmpMonitoringGreenhouseGas;
  @Input() originalGreenhouseGas: EmpMonitoringGreenhouseGas;
  @Input({ required: true }) greenhouseGasMap: SubTaskListMap<EmpMonitoringGreenhouseGas>;
  @Input() wizardStep: { [s: string]: string };
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
}
