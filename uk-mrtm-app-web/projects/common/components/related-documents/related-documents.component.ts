import { ChangeDetectionStrategy, Component, inject, input, signal, WritableSignal } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { DecisionNotification, RequestDetailsDTO, RequestTaskDTO } from '@mrtm/api';

import { AuthStore, selectUserId } from '@netz/common/auth';
import { LinkDirective } from '@netz/govuk-components';

import { PreviewDocument } from './related-documents.providers';

@Component({
  selector: 'netz-related-documents',
  standalone: true,
  templateUrl: './related-documents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LinkDirective, RouterLink],
})
export class RelatedDocumentsComponent {
  private readonly authStore: AuthStore = inject(AuthStore);

  fileDownloadPrePath = input<Array<string>>([]);
  previewDocuments = input.required<PreviewDocument[]>();
  taskId = input.required<RequestTaskDTO['id'] | RequestDetailsDTO['id']>();
  decisionNotification = input<DecisionNotification>();
  isDisabled: WritableSignal<boolean> = signal(false);

  public getDownloadLinkQueryParams(document: PreviewDocument): Params {
    const { filename } = document;
    const decisionNotification = this.decisionNotification()?.signatory
      ? this.decisionNotification()
      : {
          operators: [],
          externalContacts: [],
          signatory: this.authStore.select(selectUserId)(),
        };

    return {
      filename,
      ...decisionNotification,
    };
  }
}
