import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { of, take } from 'rxjs';
import { isNil } from 'lodash-es';

import { AccountVerificationBodyService, VerificationBodyNameInfoDTO } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { catchElseRethrow, HttpStatuses } from '@netz/common/error';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerCommonService } from '@requests/common/aer/services';
import { aerAmendQuery } from '@requests/tasks/aer-amend/+state';
import { SendReportSuccessStore } from '@requests/tasks/aer-amend/subtasks/send-report/send-report-success-message/+state/send-report-success-store.service';
import { CompetentAuthorityPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-send-report',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    ButtonDirective,
    PageHeadingComponent,
    PendingButtonDirective,
    ReturnToTaskOrActionPageComponent,
    CompetentAuthorityPipe,
  ],
  templateUrl: './send-report.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendReportComponent {
  private readonly service = inject(TaskService<AerSubmitTaskPayload>);
  private readonly store = inject(RequestTaskStore);
  private readonly accountVerificationBodyService = inject(AccountVerificationBodyService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly sendReportSuccessStore = inject(SendReportSuccessStore);
  private readonly selectRequestInfo = this.store.select(requestTaskQuery.selectRequestInfo);
  private readonly accountId = computed(() => this.selectRequestInfo()?.accountId);

  readonly competentAuthority = computed(() => this.selectRequestInfo().competentAuthority);
  readonly shouldSendToRegulator = this.store.select(aerAmendQuery.selectShouldSubmitToRegulator);
  readonly hasVerificationBody: WritableSignal<boolean> = signal(null);
  readonly verificationBody: WritableSignal<VerificationBodyNameInfoDTO> = signal(null);

  constructor() {
    effect(
      () => {
        if (this.shouldSendToRegulator()) {
          this.hasVerificationBody.set(null);
          this.verificationBody.set(null);
        } else if (!isNil(this.accountId())) {
          this.accountVerificationBodyService
            .getVerificationBodyOfAccount(this.accountId())
            .pipe(
              catchElseRethrow(
                (error) => error.status === HttpStatuses.NotFound,
                () => of(null),
              ),
              take(1),
            )
            .subscribe((verificationBody) => {
              this.hasVerificationBody.set(!!verificationBody);
              this.verificationBody.set(verificationBody);
            });
        }
      },
      { allowSignalWrites: true },
    );
  }

  onSubmit() {
    const submission$ = this.shouldSendToRegulator()
      ? this.service.submit()
      : (this.service as AerCommonService).submitForVerification();
    this.sendReportSuccessStore.setVerificationBodyNameInfo(this.verificationBody());
    submission$.subscribe(() => {
      this.router.navigate(['success'], { relativeTo: this.route, skipLocationChange: true });
    });
  }
}
