import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SaveGuidanceSectionDTO } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import {
  ButtonDirective,
  LinkDirective,
  SummaryListColumnValueDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
} from '@netz/govuk-components';

import { guidanceQuery, GuidanceStore } from '@guidance/+state';
import { ManageGuidanceSectionTypePipe } from '@guidance/pipes';
import { GuidanceService } from '@guidance/services';

@Component({
  selector: 'mrtm-manage-sections-summary',
  imports: [
    PageHeadingComponent,
    LinkDirective,
    RouterLink,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListColumnValueDirective,
    SummaryListRowActionsDirective,
    ManageGuidanceSectionTypePipe,
    ButtonDirective,
    PendingButtonDirective,
  ],
  standalone: true,
  templateUrl: './manage-sections-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageSectionsSummaryComponent {
  private readonly store = inject(GuidanceStore);
  private readonly service = inject(GuidanceService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly data = this.store.select(guidanceQuery.selectManageGuidance);
  readonly originalSection = computed(() =>
    this.store.select(guidanceQuery.selectGuidanceSectionById(Number(this.data()?.sectionId)))(),
  );

  onSubmit(): void {
    const manageObject = this.data();
    const subscription =
      manageObject.type === 'DELETE'
        ? this.service.deleteSection(manageObject.sectionId)
        : this.service.upsertSection({
            ...(manageObject.object as SaveGuidanceSectionDTO),
            id: manageObject.sectionId,
          });

    subscription.subscribe(() => {
      this.router.navigate(manageObject.type === 'DELETE' ? ['./', 'success'] : ['../', 'success'], {
        relativeTo: this.activatedRoute,
        skipLocationChange: true,
      });
    });
  }
}
