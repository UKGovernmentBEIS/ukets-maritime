import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LinkDirective, PanelComponent } from '@netz/govuk-components';

import { sendReportSuccessQuery } from '@requests/tasks/aer-amend/subtasks/send-report/send-report-success-message/+state/send-report-success.selectors';
import { SendReportSuccessStore } from '@requests/tasks/aer-amend/subtasks/send-report/send-report-success-message/+state/send-report-success-store.service';
import { CapitalizeFirstPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-send-report-success-message',
  standalone: true,
  imports: [PanelComponent, CapitalizeFirstPipe, LinkDirective, RouterLink],
  templateUrl: './send-report-success-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendReportSuccessMessageComponent {
  private readonly store = inject(SendReportSuccessStore);
  readonly verificationBody = this.store.select(sendReportSuccessQuery.selectVerificationBodyNameInfo)();
}
