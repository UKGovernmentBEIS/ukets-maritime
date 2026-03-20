import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components';
import { NotProvidedDirective } from '@shared/directives';
import { AttachedFile } from '@shared/types';

@Component({
  selector: 'mrtm-non-compliance-close-summary-template',
  imports: [
    NotProvidedDirective,
    SummaryDownloadFilesComponent,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
  ],
  standalone: true,
  template: `
    <dl govuk-summary-list>
      <div govukSummaryListRow>
        <dt govukSummaryListRowKey>Why have you decided to close this task</dt>
        <dd govukSummaryListRowValue class="pre-wrap" [notProvided]="reason()"></dd>
      </div>
      <div govukSummaryListRow>
        <dt govukSummaryListRowKey>Supporting documents</dt>
        <dd govukSummaryListRowValue><mrtm-summary-download-files [files]="files()" /></dd>
      </div>
    </dl>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceCloseSummaryTemplateComponent {
  readonly reason = input.required<string>();
  readonly files = input.required<AttachedFile[]>();
}
