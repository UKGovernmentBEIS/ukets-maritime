import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RequestActionStore } from '@netz/common/store';
import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { timelineCommonQuery } from '@requests/common';
import { virReviewedQuery } from '@requests/timeline/vir-reviewed/+state';
import { NotProvidedDirective } from '@shared/directives';
import { UserInfoResolverPipe } from '@shared/pipes';
import { AttachedFile } from '@shared/types';

@Component({
  selector: 'mrtm-vir-reviewed-details',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    LinkDirective,
    SummaryListRowActionsDirective,
    RouterLink,
    NotProvidedDirective,
    UserInfoResolverPipe,
  ],
  templateUrl: './vir-reviewed-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirReviewedDetailsComponent {
  private readonly store = inject(RequestActionStore);
  public readonly data = this.store.select(virReviewedQuery.selectPayload);

  recipientIds = computed(() =>
    Object.keys(this.data().usersInfo).filter((userId) => userId !== this.data()?.decisionNotification?.signatory),
  );

  officialNotice: Signal<AttachedFile> = computed(() => {
    const data = this.data();
    const downloadUrl = this.store.select(timelineCommonQuery.selectDownloadUrl)();

    return {
      fileName: data?.officialNotice.name,
      downloadUrl: `${downloadUrl}/document/${data?.officialNotice?.uuid}`,
    };
  });
}
