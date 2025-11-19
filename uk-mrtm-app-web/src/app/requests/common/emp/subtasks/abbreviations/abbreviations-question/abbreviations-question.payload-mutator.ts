import { inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { EmpAbbreviations } from '@mrtm/api';

import { PayloadMutator } from '@netz/common/forms';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { ABBREVIATIONS_SUB_TASK, AbbreviationsWizardStep } from '@requests/common/emp/subtasks/abbreviations';
import { SECTIONS_COMPLETE_MAP } from '@requests/common/section-completed-map.token';
import { TaskItemStatus } from '@requests/common/task-item-status';

export class AbbreviationsQuestionPayloadMutator extends PayloadMutator {
  private readonly sectionsCompletedMap = inject(SECTIONS_COMPLETE_MAP, { optional: true });
  subtask = ABBREVIATIONS_SUB_TASK;
  step = AbbreviationsWizardStep.ABBREVIATIONS_QUESTION;

  /**
   * @param currentPayload
   * @param userInput The form value of each step
   */
  apply(currentPayload: EmpTaskPayload, userInput: EmpAbbreviations): Observable<EmpTaskPayload> {
    return of(
      produce(currentPayload, (payload) => {
        payload.emissionsMonitoringPlan[this.subtask] = userInput;
        payload.empSectionsCompleted[this.sectionsCompletedMap?.[this.subtask] ?? this.subtask] =
          TaskItemStatus.IN_PROGRESS;
      }),
    );
  }
}
