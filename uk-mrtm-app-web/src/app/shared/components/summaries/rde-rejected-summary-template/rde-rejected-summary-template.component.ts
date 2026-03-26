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
  imports: [
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    NotProvidedDirective,
    SummaryListComponent,
    TitleCasePipe,
  ],
  standalone: true,
  templateUrl: './rde-rejected-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RdeRejectedSummaryTemplateComponent {
  readonly data = input.required<RdeRejectedRequestActionPayload>();
}
