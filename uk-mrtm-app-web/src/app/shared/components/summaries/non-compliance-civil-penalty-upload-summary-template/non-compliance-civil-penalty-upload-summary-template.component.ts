import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { GovukDatePipe } from '@netz/common/pipes';
import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import {
  nonComplianceCivilPenaltyMap,
  NonComplianceCivilPenaltyUpload,
  NonComplianceCivilPenaltyUploadStep,
} from '@requests/common/non-compliance';
import { SummaryDownloadFilesComponent } from '@shared/components';
import { NotProvidedDirective } from '@shared/directives';
import { AttachedFile } from '@shared/types';

@Component({
  selector: 'mrtm-non-compliance-civil-penalty-upload-summary-template',
  standalone: true,
  imports: [
    GovukDatePipe,
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
  templateUrl: './non-compliance-civil-penalty-upload-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceCivilPenaltyUploadSummaryTemplateComponent {
  private readonly authStore = inject(AuthStore);
  readonly userRole = this.authStore.select(selectUserRoleType);

  readonly data = input.required<NonComplianceCivilPenaltyUpload>();
  readonly files = input.required<AttachedFile[]>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({ change: true });
  readonly isTimeline = input<boolean>(false);

  readonly wizardStep = NonComplianceCivilPenaltyUploadStep;
  readonly map = nonComplianceCivilPenaltyMap;
}
