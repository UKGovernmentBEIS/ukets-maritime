import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components/summary-download-files/summary-download-files.component';
import { NotProvidedDirective } from '@shared/directives';
import { RfiResponse } from '@shared/types';

@Component({
  selector: 'mrtm-rfi-response-summary-template',
  standalone: true,
  imports: [
    NotProvidedDirective,
    SummaryDownloadFilesComponent,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
  ],
  templateUrl: './rfi-response-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RfiResponseSummaryTemplateComponent {
  data = input.required<RfiResponse>();
}
