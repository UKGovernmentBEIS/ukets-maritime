import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params } from '@angular/router';

import { EmpMonitoringGreenhouseGas } from '@mrtm/api';

import { ProcedureFormPartialSummaryTemplateComponent } from '@shared/components/summaries/procedure-form-partial-summary-template';
import { SubTaskListMap } from '@shared/types';

@Component({
  selector: 'mrtm-greenhouses-summary-template',
  imports: [ProcedureFormPartialSummaryTemplateComponent],
  standalone: true,
  templateUrl: './greenhouses-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreenhousesSummaryTemplateComponent {
  readonly greenhouseGas = input.required<EmpMonitoringGreenhouseGas>();
  readonly originalGreenhouseGas = input<EmpMonitoringGreenhouseGas>();
  readonly greenhouseGasMap = input.required<SubTaskListMap<EmpMonitoringGreenhouseGas>>();
  readonly wizardStep = input<{
    [s: string]: string;
  }>();
  readonly isEditable = input(false);
  readonly queryParams = input<Params>({});
}
