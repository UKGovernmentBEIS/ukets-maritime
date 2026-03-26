import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { RequestActionUserInfo } from '@mrtm/api';

import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { UserInfoResolverPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-non-compliance-notified-users-summary-template',
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    UserInfoResolverPipe,
  ],
  standalone: true,
  templateUrl: './non-compliance-notified-users-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceNotifiedUsersSummaryTemplateComponent {
  readonly notifiedUsersInfo = input.required<{ [key: string]: RequestActionUserInfo }>();
  readonly notifiedUsersIds = computed(() => Object.keys(this.notifiedUsersInfo() ?? {}));
}
