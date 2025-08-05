import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components/summary-download-files/summary-download-files.component';
import { NotProvidedDirective } from '@shared/directives';
import { RdeSubmitted } from '@shared/types';

@Component({
  selector: 'mrtm-rde-submitted-summary-template',
  standalone: true,
  imports: [
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    NotProvidedDirective,
    SummaryListComponent,
    GovukDatePipe,
    SummaryDownloadFilesComponent,
  ],
  templateUrl: './rde-submitted-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RdeSubmittedSummaryTemplateComponent {
  data = input.required<RdeSubmitted>();
}
