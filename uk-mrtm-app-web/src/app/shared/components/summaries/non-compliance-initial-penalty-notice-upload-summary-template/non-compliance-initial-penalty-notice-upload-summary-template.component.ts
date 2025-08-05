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
  nonComplianceInitialPenaltyNoticeMap,
  NonComplianceInitialPenaltyNoticeUpload,
  NonComplianceInitialPenaltyNoticeUploadStep,
} from '@requests/common/non-compliance';
import { SummaryDownloadFilesComponent } from '@shared/components';
import { NotProvidedDirective } from '@shared/directives';
import { AttachedFile } from '@shared/types';

@Component({
  selector: 'mrtm-non-compliance-initial-penalty-notice-upload-summary-template',
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
  templateUrl: './non-compliance-initial-penalty-notice-upload-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceInitialPenaltyNoticeUploadSummaryTemplateComponent {
  readonly data = input.required<NonComplianceInitialPenaltyNoticeUpload>();
  readonly files = input.required<AttachedFile[]>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({ change: true });

  readonly wizardStep = NonComplianceInitialPenaltyNoticeUploadStep;
  readonly map = nonComplianceInitialPenaltyNoticeMap;
}
