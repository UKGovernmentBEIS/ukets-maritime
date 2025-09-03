import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import {
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
  private readonly authStore = inject(AuthStore);
  readonly userRole = this.authStore.select(selectUserRoleType);

  readonly data = input.required<NonComplianceInitialPenaltyNoticeUpload>();
  readonly files = input.required<AttachedFile[]>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({ change: true });
  readonly isTimeline = input<boolean>(false);

  readonly wizardStep = NonComplianceInitialPenaltyNoticeUploadStep;
}
