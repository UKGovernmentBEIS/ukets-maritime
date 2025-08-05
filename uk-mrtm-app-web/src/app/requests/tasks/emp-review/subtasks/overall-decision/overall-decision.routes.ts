import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';

import { OperatorDetailsWizardStep } from '@requests/common/components/operator-details';
import { empReviewQuery } from '@requests/common/emp/+state';
import { overallDecisionMap, OverallDecisionWizardStep } from '@requests/common/emp/subtasks/overall-decision';
import { backlinkResolver } from '@requests/common/task-navigation';
import {
  canActivateOverallDecisionActions,
  canActivateOverallDecisionQuestion,
  canActivateOverallDecisionSummary,
} from '@requests/tasks/emp-review/subtasks/overall-decision/overall-decision.guard';
import { isOverallDecisionAndReasonCompleted } from '@requests/tasks/emp-review/subtasks/overall-decision/overall-decision.wizard';
import { DeterminationHeaderTypePipe } from '@shared/pipes';

const overallDecisionActionsBacklinkResolver = () => {
  const store = inject(RequestTaskStore);
  return () => {
    const determination = store.select(empReviewQuery.selectDetermination)();
    if (isOverallDecisionAndReasonCompleted(determination)) {
      return OperatorDetailsWizardStep.SUMMARY;
    } else {
      return '../../../';
    }
  };
};

export const OVERALL_DECISION_ROUTES: Routes = [
  {
    path: '',
    title: overallDecisionMap.title,
    canActivate: [canActivateOverallDecisionSummary],
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/tasks/emp-review/subtasks/overall-decision').then(
        (c) => c.OverallDecisionReviewSummaryComponent,
      ),
  },
  {
    path: OverallDecisionWizardStep.OVERALL_DECISION_ACTIONS,
    title: overallDecisionMap.actions.title,
    canActivate: [canActivateOverallDecisionActions],
    data: { breadcrumb: false },
    resolve: {
      backlink: overallDecisionActionsBacklinkResolver,
    },
    loadComponent: () =>
      import('@requests/tasks/emp-review/subtasks/overall-decision').then((c) => c.OverallDecisionActionsComponent),
  },
  {
    path: OverallDecisionWizardStep.OVERALL_DECISION_QUESTION,
    title: () =>
      new DeterminationHeaderTypePipe().transform(
        inject(RequestTaskStore).select(empReviewQuery.selectDetermination)().type,
      ),
    canActivate: [canActivateOverallDecisionQuestion],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(OperatorDetailsWizardStep.SUMMARY, OverallDecisionWizardStep.OVERALL_DECISION_ACTIONS),
    },
    loadComponent: () =>
      import('@requests/tasks/emp-review/subtasks/overall-decision').then((c) => c.OverallDecisionQuestionComponent),
  },
];
