import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { aerPortsMap } from '@requests/common/aer/subtasks/aer-ports';
import { PortCallsListSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-aer-list-of-port-calls-submitted',
  standalone: true,
  imports: [PageHeadingComponent, ReturnToTaskOrActionPageComponent, PortCallsListSummaryTemplateComponent],
  templateUrl: './aer-list-of-port-calls-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerListOfPortCallsSubmittedComponent {
  private readonly store = inject(RequestTaskStore);
  readonly ports = this.store.select(aerCommonQuery.selectPortsList);
  readonly map = aerPortsMap;
}
