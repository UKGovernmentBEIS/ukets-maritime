import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
  standalone: true,
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
  templateUrl: './carbon-capture-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarbonCaptureSummaryTemplateComponent {
  @Input({ required: true }) data: EmpShipEmissions['carbonCapture'];
  @Input() changeLink: string;
  @Input() isEditable: boolean = false;
  @Input() queryParams: Params = {};
  @Input() files: AttachedFile[];
}
