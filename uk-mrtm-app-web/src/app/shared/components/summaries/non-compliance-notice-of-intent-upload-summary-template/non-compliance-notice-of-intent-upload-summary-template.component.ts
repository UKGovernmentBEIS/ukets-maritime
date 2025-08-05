import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import {
  nonComplianceNoticeOfIntentMap,
  NonComplianceNoticeOfIntentUpload,
  NonComplianceNoticeOfIntentUploadStep,
} from '@requests/common/non-compliance';
import { SummaryDownloadFilesComponent } from '@shared/components';
import { NotProvidedDirective } from '@shared/directives';
import { AttachedFile } from '@shared/types';

@Component({
  selector: 'mrtm-non-compliance-notice-of-intent-upload-summary-template',
  standalone: true,
  imports: [
    LinkDirective,
    SummaryDownloadFilesComponent,
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    NotProvidedDirective,
    RouterLink,
  ],
  templateUrl: './non-compliance-notice-of-intent-upload-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceNoticeOfIntentUploadSummaryTemplateComponent {
  readonly data = input.required<NonComplianceNoticeOfIntentUpload>();
  readonly files = input.required<AttachedFile[]>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({ change: true });

  readonly wizardStep = NonComplianceNoticeOfIntentUploadStep;
  readonly map = nonComplianceNoticeOfIntentMap;
}
