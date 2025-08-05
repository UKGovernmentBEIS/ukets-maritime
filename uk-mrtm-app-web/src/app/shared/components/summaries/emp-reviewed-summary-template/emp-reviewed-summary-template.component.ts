import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components';
import { RecipientsPartialSummaryTemplateComponent } from '@shared/components/summaries/recipients-partial-summary-template';
import { NotProvidedDirective } from '@shared/directives';
import { DeterminationTypePipe } from '@shared/pipes';
import { EmpReviewedDto } from '@shared/types';

@Component({
  selector: 'mrtm-emp-reviewed-summary-template',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    LinkDirective,
    DeterminationTypePipe,
    NotProvidedDirective,
    SummaryDownloadFilesComponent,
    RouterLink,
    RecipientsPartialSummaryTemplateComponent,
  ],
  templateUrl: './emp-reviewed-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpReviewedSummaryTemplateComponent {
  private readonly authStore = inject(AuthStore);

  readonly data = input<EmpReviewedDto>();

  readonly userRole = this.authStore.select(selectUserRoleType);
  readonly officialNoticeInfo = computed(() => ({
    users: this.data()?.users,
    signatory: this.data()?.signatory,
    officialNotice: this.data()?.officialNotice,
  }));
}
