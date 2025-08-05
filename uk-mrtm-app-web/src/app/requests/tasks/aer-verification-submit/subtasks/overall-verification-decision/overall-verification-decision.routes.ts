import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import { overallVerificationDecisionMap, OverallVerificationDecisionStep } from '@requests/common/aer';
import {
  canActivateOverallVerificationDecisionAssessment,
  canActivateOverallVerificationDecisionEditOrRemoveReason,
  canActivateOverallVerificationDecisionReasons,
  canActivateOverallVerificationDecisionSummary,
} from '@requests/tasks/aer-verification-submit/subtasks/overall-verification-decision/overall-verification-decision.guard';

export const OVERALL_VERIFICATION_DECISION_ROUTES: Routes = [
  {
    path: '',
    title: overallVerificationDecisionMap.title,
    canActivate: [canActivateOverallVerificationDecisionSummary],
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/overall-verification-decision/overall-verification-decision-summary'
      ).then((c) => c.OverallVerificationDecisionSummaryComponent),
  },
  {
    path: OverallVerificationDecisionStep.ASSESSMENT,
    title: overallVerificationDecisionMap.type.title,
    canActivate: [canActivateOverallVerificationDecisionAssessment],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(OverallVerificationDecisionStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/overall-verification-decision/overall-verification-decision-assessment'
      ).then((c) => c.OverallVerificationDecisionAssessmentComponent),
  },
  {
    path: OverallVerificationDecisionStep.VERIFIED_WITH_COMMENTS_LIST,
    title: overallVerificationDecisionMap.commentsList.title,
    canActivate: [canActivateOverallVerificationDecisionReasons],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(OverallVerificationDecisionStep.SUMMARY, OverallVerificationDecisionStep.ASSESSMENT),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/overall-verification-decision/overall-verification-decision-comments-list'
      ).then((c) => c.OverallVerificationDecisionCommentsListComponent),
  },
  {
    path: OverallVerificationDecisionStep.VERIFIED_WITH_COMMENTS_FORM_ADD,
    title: overallVerificationDecisionMap.commentsFormAdd.title,
    canActivate: [canActivateOverallVerificationDecisionReasons],
    data: { breadcrumb: false },
    resolve: {
      backlink: () => `../${OverallVerificationDecisionStep.VERIFIED_WITH_COMMENTS_LIST}`,
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/overall-verification-decision/overall-verification-decision-comments-form'
      ).then((c) => c.OverallVerificationDecisionCommentsFormComponent),
  },
  {
    path: `:reasonIndex/${OverallVerificationDecisionStep.VERIFIED_WITH_COMMENTS_FORM_EDIT}`,
    title: overallVerificationDecisionMap.commentsFormEdit.title,
    canActivate: [canActivateOverallVerificationDecisionEditOrRemoveReason],
    data: { breadcrumb: false },
    resolve: {
      backlink: () => `../../${OverallVerificationDecisionStep.VERIFIED_WITH_COMMENTS_LIST}`,
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/overall-verification-decision/overall-verification-decision-comments-form'
      ).then((c) => c.OverallVerificationDecisionCommentsFormComponent),
  },
  {
    path: `:reasonIndex/${OverallVerificationDecisionStep.VERIFIED_WITH_COMMENTS_DELETE}`,
    title: overallVerificationDecisionMap.commentsDelete.title,
    canActivate: [canActivateOverallVerificationDecisionEditOrRemoveReason],
    data: { breadcrumb: false },
    resolve: {
      backlink: () => `../../${OverallVerificationDecisionStep.VERIFIED_WITH_COMMENTS_LIST}`,
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/overall-verification-decision/overall-verification-decision-comments-delete'
      ).then((c) => c.OverallVerificationDecisionCommentsDeleteComponent),
  },
  {
    path: OverallVerificationDecisionStep.NOT_VERIFIED_REASONS,
    title: overallVerificationDecisionMap.notVerifiedReasons.title,
    canActivate: [canActivateOverallVerificationDecisionAssessment],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(OverallVerificationDecisionStep.SUMMARY, OverallVerificationDecisionStep.ASSESSMENT),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/overall-verification-decision/overall-verification-decision-not-verified-reasons'
      ).then((c) => c.OverallVerificationDecisionNotVerifiedReasonsComponent),
  },
];
