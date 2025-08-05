import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { GovukDatePipe } from '@netz/common/pipes';
import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components/summary-download-files/summary-download-files.component';
import { NotProvidedDirective } from '@shared/directives';
import { FollowUpReviewDecisionDTO } from '@shared/types';

@Component({
  selector: 'mrtm-follow-up-returned-for-amends-summary-template',
  standalone: true,
  imports: [
    SummaryDownloadFilesComponent,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    GovukDatePipe,
    NotProvidedDirective,
  ],
  templateUrl: './follow-up-returned-for-amends-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowUpReturnedForAmendsSummaryTemplateComponent {
  private readonly authStore = inject(AuthStore);
  readonly userRole = this.authStore.select(selectUserRoleType);
  readonly followUpReturnedAmends = input.required<Omit<FollowUpReviewDecisionDTO, 'type'>>();
}
