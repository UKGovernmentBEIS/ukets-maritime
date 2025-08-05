import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RdeRejectedRequestActionPayload } from '@mrtm/api';

import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { NotProvidedDirective } from '@shared/directives';

@Component({
  selector: 'mrtm-rde-rejected-summary-template',
  standalone: true,
  imports: [
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    NotProvidedDirective,
    SummaryListComponent,
    TitleCasePipe,
  ],
  templateUrl: './rde-rejected-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RdeRejectedSummaryTemplateComponent {
  data = input.required<RdeRejectedRequestActionPayload>();
}
