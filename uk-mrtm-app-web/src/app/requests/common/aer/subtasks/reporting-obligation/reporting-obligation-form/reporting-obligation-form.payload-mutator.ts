import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { REPORTING_OBLIGATION_SUB_TASK } from '@requests/common/aer/subtasks/reporting-obligation';
import { ReportingObligationWizardStep } from '@requests/common/aer/subtasks/reporting-obligation/reporting-obligation.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { UploadedFile } from '@shared/types';
import { createFileUploadPayload, transformToTaskAttachments } from '@shared/utils';

export class ReportingObligationFormPayloadMutator extends PayloadMutator {
  subtask = REPORTING_OBLIGATION_SUB_TASK;
  step = ReportingObligationWizardStep.FORM;

  apply(
    currentPayload: AerSubmitTaskPayload,
    userInput: Pick<AerSubmitTaskPayload, 'reportingRequired'> &
      Omit<AerSubmitTaskPayload['reportingObligationDetails'], 'supportingDocuments'> & {
        supportingDocuments: UploadedFile[];
      },
  ): Observable<AerSubmitTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.reportingRequired = userInput.reportingRequired;
        payload.reportingObligationDetails = payload.reportingRequired
          ? null
          : {
              noReportingReason: userInput.noReportingReason,
              supportingDocuments: createFileUploadPayload(userInput.supportingDocuments),
            };
        payload.aerAttachments = {
          ...payload.aerAttachments,
          ...transformToTaskAttachments(userInput.supportingDocuments),
        };
        payload.aerSectionsCompleted[this.subtask] = TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
