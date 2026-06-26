import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { map, of, switchMap } from 'rxjs';

import { CaExternalContactsService } from '@mrtm/api';

import { RequestActionStore } from '@netz/common/store';

import { nonComplianceNoticeOfIntentSubmittedQuery } from '@requests/timeline/non-compliance-notice-of-intent-submitted/+state';
import {
  NonComplianceNoticeOfIntentUploadSummaryTemplateComponent,
  NonComplianceNotifiedUsersSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-non-compliance-notice-of-intent-submitted',
  imports: [
    NonComplianceNoticeOfIntentUploadSummaryTemplateComponent,
    NonComplianceNotifiedUsersSummaryTemplateComponent,
  ],
  standalone: true,
  template: `
    <mrtm-non-compliance-notice-of-intent-upload-summary-template
      [data]="data()"
      [files]="files()"
      [isTimeline]="true" />
    <mrtm-non-compliance-notified-users-summary-template
      [notifiedUsersInfo]="notifiedUsersInfo()"
      [externalContacts]="externalContacts()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceNoticeOfIntentSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  private readonly caExternalContactsService = inject(CaExternalContactsService);
  private readonly externalContactsIds = this.store.select(
    nonComplianceNoticeOfIntentSubmittedQuery.selectExternalContactsIds,
  );
  readonly data = this.store.select(nonComplianceNoticeOfIntentSubmittedQuery.selectNonComplianceNoticeOfIntentUpload);
  readonly files = computed(() =>
    this.store.select(nonComplianceNoticeOfIntentSubmittedQuery.selectAttachedFiles([this.data()?.noticeOfIntent]))(),
  );
  readonly notifiedUsersInfo = this.store.select(nonComplianceNoticeOfIntentSubmittedQuery.selectNotifiedUsersInfo);

  readonly externalContacts = toSignal(
    toObservable(this.externalContactsIds).pipe(
      switchMap((ids) =>
        ids?.length
          ? this.caExternalContactsService
              .getCaExternalContacts()
              .pipe(
                map((contacts) =>
                  (contacts?.caExternalContacts ?? [])
                    .filter((contact) => ids.includes(contact.id))
                    .map((contact) => contact.email),
                ),
              )
          : of([]),
      ),
    ),
  );
}
