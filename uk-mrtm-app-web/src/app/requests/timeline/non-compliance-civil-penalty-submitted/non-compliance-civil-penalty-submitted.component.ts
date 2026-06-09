import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { map, of, switchMap } from 'rxjs';

import { CaExternalContactsService } from '@mrtm/api';

import { RequestActionStore } from '@netz/common/store';

import { nonComplianceCivilPenaltySubmittedQuery } from '@requests/timeline/non-compliance-civil-penalty-submitted/+state';
import {
  NonComplianceCivilPenaltyUploadSummaryTemplateComponent,
  NonComplianceNotifiedUsersSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-non-compliance-civil-penalty-submitted',
  imports: [
    NonComplianceCivilPenaltyUploadSummaryTemplateComponent,
    NonComplianceNotifiedUsersSummaryTemplateComponent,
  ],
  standalone: true,
  template: `
    <h2 class="govuk-heading-m">Details</h2>
    <mrtm-non-compliance-civil-penalty-upload-summary-template [data]="data()" [files]="files()" [isTimeline]="true" />
    <mrtm-non-compliance-notified-users-summary-template
      [notifiedUsersInfo]="notifiedUsersInfo()"
      [externalContacts]="externalContacts()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceCivilPenaltySubmittedComponent {
  private readonly store = inject(RequestActionStore);
  private readonly caExternalContactsService = inject(CaExternalContactsService);
  private readonly externalContactsIds = this.store.select(
    nonComplianceCivilPenaltySubmittedQuery.selectExternalContactsIds,
  );

  readonly data = this.store.select(nonComplianceCivilPenaltySubmittedQuery.selectNonComplianceCivilPenaltyUpload);
  readonly files = computed(() =>
    this.store.select(nonComplianceCivilPenaltySubmittedQuery.selectAttachedFiles([this.data()?.civilPenalty]))(),
  );
  readonly notifiedUsersInfo = this.store.select(nonComplianceCivilPenaltySubmittedQuery.selectNotifiedUsersInfo);
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
