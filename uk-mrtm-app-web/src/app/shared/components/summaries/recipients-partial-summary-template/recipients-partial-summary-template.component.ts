import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components';
import { NotProvidedDirective } from '@shared/directives';
import { OfficialNoticeInfo } from '@shared/types';

@Component({
  selector: 'mrtm-recipients-partial-summary-template',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    NotProvidedDirective,
    SummaryDownloadFilesComponent,
  ],
  templateUrl: './recipients-partial-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipientsPartialSummaryTemplateComponent {
  officialNoticeInfo = input.required<OfficialNoticeInfo>();
}
