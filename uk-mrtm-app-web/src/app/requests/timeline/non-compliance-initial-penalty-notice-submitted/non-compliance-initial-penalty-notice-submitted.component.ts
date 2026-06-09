import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { map, of, switchMap } from 'rxjs';

import { CaExternalContactsService } from '@mrtm/api';

import { RequestActionStore } from '@netz/common/store';

import { nonComplianceInitialPenaltyNoticeSubmittedQuery } from '@requests/timeline/non-compliance-initial-penalty-notice-submitted/+state';
import {
  NonComplianceInitialPenaltyNoticeUploadSummaryTemplateComponent,
  NonComplianceNotifiedUsersSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-non-compliance-initial-penalty-notice-submitted',
  imports: [
    NonComplianceInitialPenaltyNoticeUploadSummaryTemplateComponent,
    NonComplianceNotifiedUsersSummaryTemplateComponent,
  ],
  standalone: true,
  template: `
    <mrtm-non-compliance-initial-penalty-notice-upload-summary-template
      [data]="data()"
      [files]="files()"
      [isTimeline]="true" />
    <mrtm-non-compliance-notified-users-summary-template
      [notifiedUsersInfo]="notifiedUsersInfo()"
      [externalContacts]="externalContacts()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceInitialPenaltyNoticeSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  private readonly caExternalContactsService = inject(CaExternalContactsService);
  private readonly externalContactsIds = this.store.select(
    nonComplianceInitialPenaltyNoticeSubmittedQuery.selectExternalContactsIds,
  );

  readonly data = this.store.select(
    nonComplianceInitialPenaltyNoticeSubmittedQuery.selectNonComplianceInitialPenaltyNoticeUpload,
  );
  readonly files = computed(() =>
    this.store.select(
      nonComplianceInitialPenaltyNoticeSubmittedQuery.selectAttachedFiles([this.data()?.initialPenaltyNotice]),
    )(),
  );
  readonly notifiedUsersInfo = this.store.select(
    nonComplianceInitialPenaltyNoticeSubmittedQuery.selectNotifiedUsersInfo,
  );

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
