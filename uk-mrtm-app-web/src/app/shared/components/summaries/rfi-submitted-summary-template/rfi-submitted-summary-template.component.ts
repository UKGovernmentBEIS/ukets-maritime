import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components';
import { NotProvidedDirective } from '@shared/directives';
import { RfiSubmitted } from '@shared/types';

@Component({
  selector: 'mrtm-rfi-submitted-summary-template',
  standalone: true,
  imports: [
    NotProvidedDirective,
    SummaryDownloadFilesComponent,
    GovukDatePipe,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
  ],
  templateUrl: './rfi-submitted-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RfiSubmittedSummaryTemplateComponent {
  data = input.required<RfiSubmitted>();
}
