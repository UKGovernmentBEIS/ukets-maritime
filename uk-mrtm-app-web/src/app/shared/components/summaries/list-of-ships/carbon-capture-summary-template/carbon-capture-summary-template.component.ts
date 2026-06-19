import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { EmpShipEmissions } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components';
import { BooleanToTextPipe } from '@shared/pipes';
import { AttachedFile } from '@shared/types';

@Component({
  selector: 'mrtm-carbon-capture-summary-template',
  imports: [
    SummaryListComponent,
    LinkDirective,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    RouterLink,
    BooleanToTextPipe,
    SummaryDownloadFilesComponent,
  ],
  standalone: true,
  templateUrl: './carbon-capture-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarbonCaptureSummaryTemplateComponent {
  readonly data = input.required<EmpShipEmissions['carbonCapture']>();
  readonly changeLink = input<string>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({});
  readonly files = input<AttachedFile[]>();
}
