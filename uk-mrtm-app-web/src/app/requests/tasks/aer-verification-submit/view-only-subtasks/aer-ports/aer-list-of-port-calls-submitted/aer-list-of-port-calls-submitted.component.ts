import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { aerPortsMap } from '@requests/common/aer/subtasks/aer-ports';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import { PortCallsListSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-aer-list-of-port-calls-submitted',
  imports: [PageHeadingComponent, ReturnToTaskOrActionPageComponent, PortCallsListSummaryTemplateComponent],
  standalone: true,
  templateUrl: './aer-list-of-port-calls-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerListOfPortCallsSubmittedComponent {
  private readonly store = inject(RequestTaskStore);
  readonly ports = this.store.select(aerVerificationSubmitQuery.selectPortsList);
  readonly map = aerPortsMap;
}
