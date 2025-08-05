import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
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
import { NotProvidedDirective } from '@shared/directives';
import { DeterminationTypePipe } from '@shared/pipes';
import { EmpVariationReviewedDto } from '@shared/types';

@Component({
  selector: 'mrtm-emp-variation-reviewed-summary-template',
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
  ],
  templateUrl: './emp-variation-reviewed-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVariationReviewedSummaryTemplateComponent {
  private readonly authStore = inject(AuthStore);
  public readonly userRole = this.authStore.select(selectUserRoleType);
  public readonly data = input<EmpVariationReviewedDto>();
  public readonly isEmpVariationRegulator = input<boolean>(false);
}
