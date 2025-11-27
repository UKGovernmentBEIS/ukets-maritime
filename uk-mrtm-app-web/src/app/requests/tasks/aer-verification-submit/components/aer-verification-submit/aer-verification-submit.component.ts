import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { TaskSuperListComponent } from '@netz/common/components';
import { TaskSuperSection } from '@netz/common/model';
import { RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { aerCommonQuery } from '@requests/common/aer/+state';
import { AER_VERIFICATION_SUBMIT_ROUTE_PREFIX } from '@requests/common/aer/aer.consts';
import {
  getAerSubmittedSubtaskSections,
  getAerVerificationAssessmentsAndFindingsSections,
} from '@requests/common/aer/helpers';
import { getCanSubmitAerVerification } from '@requests/tasks/aer-verification-submit/aer-verification-submit.helpers';
import {
  SEND_REPORT_SUB_TASK,
  SEND_REPORT_SUB_TASK_PATH,
} from '@requests/tasks/aer-verification-submit/subtasks/send-report/send-report.helpers';

@Component({
  selector: 'mrtm-aer-verification-submit',
  standalone: true,
  imports: [TaskSuperListComponent],
  templateUrl: './aer-verification-submit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerVerificationSubmitComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly aer = this.store.select(aerCommonQuery.selectAer);
  private readonly sectionsCompleted = this.store.select(aerCommonQuery.selectVerificationSectionsCompleted);
  private readonly canSubmitAerVerification = getCanSubmitAerVerification();

  readonly superSections: Signal<TaskSuperSection[]> = computed(() => {
    return [
      {
        superTitle: 'Add assessments and findings',
        sections: getAerVerificationAssessmentsAndFindingsSections(
          AER_VERIFICATION_SUBMIT_ROUTE_PREFIX,
          this.sectionsCompleted(),
          this.aer(),
        ),
      },
      {
        superTitle: 'Review operator’s application and send your report',
        sections: [
          ...getAerSubmittedSubtaskSections(AER_VERIFICATION_SUBMIT_ROUTE_PREFIX, this.aer(), true),
          {
            title: 'Send report',
            tasks: [
              {
                name: SEND_REPORT_SUB_TASK,
                status: this.canSubmitAerVerification ? TaskItemStatus.NOT_STARTED : TaskItemStatus.CANNOT_START_YET,
                linkText: 'Send report to operator',
                link: this.canSubmitAerVerification
                  ? `${AER_VERIFICATION_SUBMIT_ROUTE_PREFIX}/${SEND_REPORT_SUB_TASK_PATH}`
                  : null,
              },
            ],
          },
        ],
      },
    ];
  });
}
