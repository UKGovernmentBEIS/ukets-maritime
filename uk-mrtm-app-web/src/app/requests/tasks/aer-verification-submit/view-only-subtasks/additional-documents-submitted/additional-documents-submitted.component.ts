import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { aerAdditionalDocumentsMap } from '@requests/common/aer';
import { aerCommonQuery } from '@requests/common/aer/+state';
import { AdditionalDocumentsSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-additional-documents-submitted',
  imports: [PageHeadingComponent, AdditionalDocumentsSummaryTemplateComponent, ReturnToTaskOrActionPageComponent],
  standalone: true,
  templateUrl: './additional-documents-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalDocumentsSubmittedComponent {
  private readonly store = inject(RequestTaskStore);

  readonly additionalDocuments = this.store.select(aerCommonQuery.selectAerAdditionalDocuments);
  readonly additionalDocumentsMap = aerAdditionalDocumentsMap;
  readonly files = computed(() =>
    this.store.select(aerCommonQuery.selectAttachedFiles(this.additionalDocuments()?.documents))(),
  );
}
