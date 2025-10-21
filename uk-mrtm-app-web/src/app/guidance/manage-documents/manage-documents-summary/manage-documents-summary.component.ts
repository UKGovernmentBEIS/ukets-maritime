import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

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
import { ManageGuidanceDocumentDTO } from '@guidance/guidance.types';
import { ManageGuidanceDocumentTypePipe } from '@guidance/pipes';
import { GuidanceService } from '@guidance/services';

@Component({
  selector: 'mrtm-manage-documents-summary',
  standalone: true,
  imports: [
    PageHeadingComponent,
    LinkDirective,
    RouterLink,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListColumnValueDirective,
    SummaryListRowActionsDirective,
    ButtonDirective,
    PendingButtonDirective,
    ManageGuidanceDocumentTypePipe,
  ],
  templateUrl: './manage-documents-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageDocumentsSummaryComponent {
  private readonly store = inject(GuidanceStore);
  private readonly service = inject(GuidanceService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly data = this.store.select(guidanceQuery.selectManageGuidance);
  readonly section = computed(() =>
    this.store.select(guidanceQuery.selectGuidanceSectionById(Number(this.data()?.sectionId)))(),
  );
  readonly originalDocument = computed(() =>
    this.section()?.guidanceDocuments?.find((document) => document.id === this.data()?.documentId),
  );

  onSubmit(): void {
    const manageObject = this.data();
    const subscription =
      manageObject.type === 'DELETE'
        ? this.service.deleteDocument(manageObject.documentId, manageObject.sectionId)
        : this.service.upsertDocument({
            ...(manageObject.object as ManageGuidanceDocumentDTO),
            id: manageObject.documentId,
          });

    subscription.subscribe(() => {
      this.router.navigate(manageObject.type === 'DELETE' ? ['./', 'success'] : ['../', 'success'], {
        relativeTo: this.activatedRoute,
        skipLocationChange: true,
      });
    });
  }
}
